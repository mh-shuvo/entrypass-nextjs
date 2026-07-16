import prisma from "@/lib/prisma";
import { seedUsers } from "./seeders/userSeeder";

async function main() {
  console.log("Seeding database...");
    await seedUsers();
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });