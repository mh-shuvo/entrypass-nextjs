import prisma  from "@/lib/prisma";

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
}