import { PrismaClient, BusinessRoleCode } from "@prisma/client";
import argon2 from "argon2";
import {
  OPERATIONS_REVIEWER,
  PERMISSION_MATRIX,
} from "../src/modules/users/permissions/permission-codes.js";

const prisma = new PrismaClient();

async function main() {
  const leadSources = [
    { code: "EXHIBITION", name: "Exhibition" },
    { code: "REFERRAL", name: "Referral" },
    { code: "WEBSITE", name: "Website" },
    { code: "INBOUND_INQUIRY", name: "Inbound Inquiry" },
    { code: "MANUAL_ENTRY", name: "Manual Entry" },
    { code: "OTHER", name: "Other" },
  ];

  for (const source of leadSources) {
    await prisma.leadSource.upsert({
      where: { code: source.code },
      update: { name: source.name, status: "ACTIVE" },
      create: { ...source, status: "ACTIVE" },
    });
  }

  const roles = [
    {
      code: BusinessRoleCode.ADMIN,
      name: "Admin",
      description: "Platform administrator with full user and system access.",
      isSystemManaged: true,
    },
    {
      code: BusinessRoleCode.MANAGER,
      name: "Manager",
      description: "Team manager.",
      isSystemManaged: true,
    },
    {
      code: BusinessRoleCode.SALES_REPRESENTATIVE,
      name: "Sales Representative",
      description: "Sales representative.",
      isSystemManaged: true,
    },
  ];

  for (const role of roles) {
    await prisma.businessRole.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }

  for (const permission of PERMISSION_MATRIX) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
      create: {
        code: permission.code,
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
    });

    for (const grantee of permission.grantedTo) {
      await prisma.permissionGrant.upsert({
        where: {
          granteeType_granteeCode_permissionCode: {
            granteeType: grantee === OPERATIONS_REVIEWER ? "ACCESS_PROFILE" : "BUSINESS_ROLE",
            granteeCode: grantee,
            permissionCode: permission.code,
          },
        },
        update: {},
        create: {
          granteeType: grantee === OPERATIONS_REVIEWER ? "ACCESS_PROFILE" : "BUSINESS_ROLE",
          granteeCode: grantee,
          permissionCode: permission.code,
        },
      });
    }
  }

  const email = process.env.SEEDED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEEDED_ADMIN_PASSWORD ?? "ChangeThisPassword123!";
  const admin = await prisma.platformUser.upsert({
    where: { email: email.toLowerCase() },
    update: {
      displayName: "Seeded Admin",
      passwordHash: await argon2.hash(password),
      status: "ACTIVE",
      activatedAt: new Date(),
    },
    create: {
      email: email.toLowerCase(),
      displayName: "Seeded Admin",
      passwordHash: await argon2.hash(password),
      status: "ACTIVE",
      activatedAt: new Date(),
    },
  });

  const existingAdminRole = await prisma.roleAssignment.findFirst({
    where: { userId: admin.id, roleCode: BusinessRoleCode.ADMIN, status: "ACTIVE" },
  });
  if (!existingAdminRole) {
    await prisma.roleAssignment.create({
      data: { userId: admin.id, roleCode: BusinessRoleCode.ADMIN, status: "ACTIVE" },
    });
  }
}

await main().finally(async () => {
  await prisma.$disconnect();
});
