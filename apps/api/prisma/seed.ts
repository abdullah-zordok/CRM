import { PrismaClient, RoleCategoryCode } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      code: RoleCategoryCode.ADMIN,
      name: "Admin",
      description: "Foundation administrator with protected shell access.",
    },
    {
      code: RoleCategoryCode.MANAGER,
      name: "Manager",
      description: "Baseline manager role category reserved for Phase 1.",
    },
    {
      code: RoleCategoryCode.SALES_REPRESENTATIVE,
      name: "Sales Representative",
      description: "Baseline sales representative role category reserved for Phase 1.",
    },
  ];

  for (const role of roles) {
    await prisma.roleCategory.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }

  const email = process.env.SEEDED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEEDED_ADMIN_PASSWORD ?? "ChangeThisPassword123!";
  const adminRole = await prisma.roleCategory.findUniqueOrThrow({
    where: { code: RoleCategoryCode.ADMIN },
  });
  const admin = await prisma.foundationUser.upsert({
    where: { email: email.toLowerCase() },
    update: {
      displayName: "Seeded Admin",
      passwordHash: await argon2.hash(password),
    },
    create: {
      email: email.toLowerCase(),
      displayName: "Seeded Admin",
      passwordHash: await argon2.hash(password),
    },
  });

  await prisma.foundationUserRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });
}

await main().finally(async () => {
  await prisma.$disconnect();
});
