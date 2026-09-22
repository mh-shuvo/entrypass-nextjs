import { hash, genSalt } from "bcryptjs";
import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { Permission, UserType } from "@prisma/client";

interface FakeUser {
  name: string;
  email: string;
  password: string;
  UserType?: UserType;
}

function generateRandomUser(count: number = 20): FakeUser[] {
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: "123456789",
    UserType: UserType.EXECUTIVE,
  }));
}

export async function seedUsers() {
  console.log("Seeding users...");
  const salt = await genSalt(10);
  const password = await hash("123456789", salt);

  const users: FakeUser[] = [
    ...[
      { name: "John Doe", email: "john.doe@example.com", password: password, UserType: UserType.EXECUTIVE },
      { name: "Jane Smith", email: "jane.smith@example.com", password: password, UserType: UserType.EXECUTIVE },
      { name: "Super Admin", email: "admin@example.com", password: password, UserType: UserType.SUPERADMIN }
    ],
    ...generateRandomUser(20)
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
        UserType: user.UserType ?? UserType.EXECUTIVE,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
        UserType: user.UserType ?? UserType.EXECUTIVE,
      },
    });
  }

  // 1. Fetching only the Superadmins
  const all_su_users = await prisma.user.findMany({
    where: {
      UserType: "SUPERADMIN"
    }
  });
  
  // 2. Extracting enum values dynamically
  const allPermissions = Object.values(Permission);

  // 3. Mass-assigning all permissions to each discovered Superadmin
  if (all_su_users.length > 0) {
    console.log(`Assigning ${allPermissions.length} permissions to ${all_su_users.length} superadmins...`);
    for (const user of all_su_users) {
      await prisma.userPermission.createMany({
        data: allPermissions.map((permission) => ({
          userId: user.id,
          permission: permission,
        })),
        skipDuplicates: true, 
      });
    }
  }
  
  console.log("Users and superadmin permissions seeded successfully!");
}
