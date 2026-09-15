import { hash,genSalt } from "bcryptjs";
import prisma from "@/lib/prisma";
import {faker} from "@faker-js/faker";

interface FakeUser {
    name: string;
    email: string;
    password: string;
}

function generateRandomUser(count:number=20):FakeUser[] {
    return Array.from({ length: count }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: "123456789"
    }));
}

export async function seedUsers() {
  
    console.log("Seeding users...");
    const salt = await genSalt(10);
    const password = await hash("123456789", salt);
  
    const users = [
      ...[
        { name: "John Doe", email: "john.doe@example.com", password: password },
        { name: "Jane Smith", email: "jane.smith@example.com", password: password }
      ],
      ...generateRandomUser(20)
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