import prisma  from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { StageChunks } from "next/dist/server/app-render/instant-validation/instant-validation";

const PAGE_SIZE = 10;

// Never selects `password`, so the hash cannot leak into a server action response.
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  phone:true,
  createdAt: true,
  updatedAt: true,
  UserType: true,
} satisfies Prisma.UserSelect;


export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;

export class UserRepository {
  async findAllUsers(page: number = 1): Promise<SafeUser[]> {
    return prisma.user.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data:Prisma.UserCreateInput): Promise<SafeUser>{
    return prisma.user.create({data, select: safeUserSelect})
  }


  async findUserById(id: number): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }
}
