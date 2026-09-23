import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 10;

// Never selects `password`, so the hash cannot leak into a server action response.
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
  UserType: true,
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
    const where = this.buildUserSearch(search);

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

  async findUserById(id: number): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }
}
