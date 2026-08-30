import prisma  from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 10;
const page = 1;

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

  async create(data:Prisma.UserCreateInput){
    return prisma.user.create({data})
  }
}
