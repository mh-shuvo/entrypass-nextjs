import prisma from "@/lib/prisma";
import { ExecutivePermission, Permission, UserType, type Prisma } from "@prisma/client";
const PAGE_SIZE = 10;
const DEFAULT_PERMISSIONS = Object.values(Permission) as Permission[];
const EXECUTIVE_DEFAULT_PERMISSIONS = Object.values(ExecutivePermission) as Permission[];

// Never selects `password`, so the hash cannot leak into a server action response.
export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
  UserType: true,
  permissions: {
    where: { deletedAt: null },
    select: { permission: true },
  },
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;

export class UserRepository {
  private buildUserSearch(search: string): Prisma.UserWhereInput {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      return {};
    }

    return {
      OR: [
        { name: { contains: trimmedSearch } },
        { email: { contains: trimmedSearch } },
        { phone: { contains: trimmedSearch } },
      ],
    };
  }

  async findAllUsers(page: number = 1, search: string = ""): Promise<SafeUser[]> {
    const where = {
      AND:{
        UserType:UserType.EXECUTIVE
      },
      ...this.buildUserSearch(search)
    };
    return prisma.user.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      select: safeUserSelect,
    });
  }

  async countUsers(search: string = ""): Promise<number> {
    return prisma.user.count({
      where: this.buildUserSearch(search),
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<SafeUser> {
    return prisma.user.create({ data, select: safeUserSelect });
  }

  async createDefaultPermissions(userId: number, userType: UserType): Promise<void> {
    const permissions: Permission[] =
      userType === UserType.SUPERADMIN ? DEFAULT_PERMISSIONS : EXECUTIVE_DEFAULT_PERMISSIONS;

    await prisma.userPermission.createMany({
      data: permissions.map((permission) => ({
        userId,
        permission,
      })),
      skipDuplicates: true,
    });
  }

  async findUserById(id: number): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }

  async updateUserPermissions(userId: number, permissions: Permission[]): Promise<void> {
    const selectedPermissions = Array.from(new Set(permissions));

    await prisma.$transaction(async (tx) => {
      const existingPermissions = await tx.userPermission.findMany({
        where: { userId },
        select: { permission: true, deletedAt: true },
      });

      const activePermissions = new Set(
        existingPermissions
          .filter((row) => row.deletedAt === null)
          .map((row) => row.permission)
      );

      const permissionsToDeactivate = existingPermissions
        .filter((row) => row.deletedAt === null && !selectedPermissions.includes(row.permission))
        .map((row) => row.permission);

      if (permissionsToDeactivate.length > 0) {
        await tx.userPermission.updateMany({
          where: {
            userId,
            permission: { in: permissionsToDeactivate },
            deletedAt: null,
          },
          data: { deletedAt: new Date() },
        });
      }

      for (const permission of selectedPermissions) {
        if (activePermissions.has(permission)) {
          continue;
        }

        await tx.userPermission.upsert({
          where: {
            userId_permission: {
              userId,
              permission,
            },
          },
          update: {
            deletedAt: null,
          },
          create: {
            userId,
            permission,
          },
        });
      }
    });
  }
}
