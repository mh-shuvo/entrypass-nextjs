import prisma from "@/lib/prisma";
import { seedUsers } from "./seeds/userSeeder";
import { seedEvents } from "./seeds/eventSeeder";

async function main() {
  console.log("Seeding database...");
    await seedUsers();
    await seedEvents();
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });