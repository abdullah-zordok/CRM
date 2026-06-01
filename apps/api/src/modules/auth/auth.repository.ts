import { Injectable } from "@nestjs/common";
import { AuthSessionRevocationReason, AuthSessionStatus, PlatformUserStatus } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.platformUser.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roleAssignments: true,
        reviewerAssignments: true,
        teamMemberships: { include: { team: true } },
      },
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
      include: {
        user: {
          include: {
            roleAssignments: true,
            reviewerAssignments: true,
            teamMemberships: { include: { team: true } },
          },
        },
      },
    });
  }

  revokeSession(
    sessionHash: string,
    reason: AuthSessionRevocationReason = AuthSessionRevocationReason.LOGOUT,
  ) {
    return this.prisma.authSession.updateMany({
      where: { sessionHash, status: AuthSessionStatus.ACTIVE },
      data: { status: AuthSessionStatus.REVOKED, revokedAt: new Date(), revocationReason: reason },
    });
  }

  isActive(status: PlatformUserStatus): boolean {
    return status === PlatformUserStatus.ACTIVE;
  }
}
