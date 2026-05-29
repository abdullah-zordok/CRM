import { Injectable } from "@nestjs/common";
import { AuthSessionStatus, FoundationUserStatus, RoleCategoryCode } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.foundationUser.findUnique({
      where: { email: email.toLowerCase() },
      include: { roles: { include: { role: true } } },
    });
  }

  createSession(userId: string, sessionHash: string, expiresAt: Date) {
    return this.prisma.authSession.create({
      data: { userId, sessionHash, expiresAt },
    });
  }

  findActiveSession(sessionHash: string) {
    return this.prisma.authSession.findUnique({
      where: { sessionHash },
      include: { user: { include: { roles: { include: { role: true } } } } },
    });
  }

  revokeSession(sessionHash: string) {
    return this.prisma.authSession.updateMany({
      where: { sessionHash, status: AuthSessionStatus.ACTIVE },
      data: { status: AuthSessionStatus.REVOKED, revokedAt: new Date() },
    });
  }

  async ensureRoleCategories() {
    const roles = [
      RoleCategoryCode.ADMIN,
      RoleCategoryCode.MANAGER,
      RoleCategoryCode.SALES_REPRESENTATIVE,
    ];
    for (const code of roles) {
      await this.prisma.roleCategory.upsert({
        where: { code },
        update: {},
        create: { code, name: code.replace("_", " "), description: `${code} baseline role` },
      });
    }
  }

  isActive(status: FoundationUserStatus) {
    return status === FoundationUserStatus.ACTIVE;
  }
}
