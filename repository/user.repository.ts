import prisma  from "@/lib/prisma";

export class UserRepository {
  async findAllUsers() {
    return prisma.user.findMany();
  }
}