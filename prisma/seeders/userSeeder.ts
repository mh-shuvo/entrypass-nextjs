import prisma from "@/lib/prisma";
export async function seedUsers() {
  
    console.log("Seeding users...");

  const users = [
    { name: "John Doe", email: "john.doe@example.com", password: "123456789" },
    { name: "Jane Smith", email: "jane.smith@example.com", password: "123456789" }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
}