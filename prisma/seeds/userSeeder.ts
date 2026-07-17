import { hash,genSalt } from "bcryptjs";
import prisma from "@/lib/prisma";
export async function seedUsers() {
  
    console.log("Seeding users...");
    const salt = await genSalt(10);
    const password = await hash("123456789", salt);
  const users = [
    { name: "John Doe", email: "john.doe@example.com", password: password },
    { name: "Jane Smith", email: "jane.smith@example.com", password: password }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
      },
    });
  }
}