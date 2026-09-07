import prisma  from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 10;
const page = 1;

// Never selects `password`, so the hash cannot leak into a server action response.
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;

export class UserRepository {
  async findAllUsers() {
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
}
