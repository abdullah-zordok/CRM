import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthSessionStatus, SecurityAuditOutcome } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { AuthRepository } from "./auth.repository.js";
import { SecurityAuditService } from "./audit/security-audit.service.js";
import { PasswordService } from "./security/password.service.js";
import { SessionTokenService } from "./security/session-token.service.js";

const sessionTtlMs = 1000 * 60 * 60 * 8;

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwords: PasswordService,
    private readonly tokens: SessionTokenService,
    private readonly audit: SecurityAuditService,
  ) {}

  async login(email: string, password: string, correlationId = randomUUID()) {
    const user = await this.repository.findUserByEmail(email);
    if (!user || !user.passwordHash || !this.repository.isActive(user.status)) {
      await this.audit.record({
        eventType: "LOGIN_FAILURE",
        outcome: SecurityAuditOutcome.FAILURE,
        correlationId,
        resource: "auth",
        metadata: { email },
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await this.passwords.verify(user.passwordHash, password);
    if (!ok) {
      await this.audit.record({
        eventType: "LOGIN_FAILURE",
        outcome: SecurityAuditOutcome.FAILURE,
        correlationId,
        resource: "auth",
        metadata: { email },
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.tokens.createToken();
    const session = await this.repository.createSession(
      user.id,
      this.tokens.hash(token),
      new Date(Date.now() + sessionTtlMs),
    );
    await this.audit.record({
      eventType: "LOGIN_SUCCESS",
      outcome: SecurityAuditOutcome.SUCCESS,
      actorUserId: user.id,
      targetUserId: user.id,
      sessionId: session.id,
      correlationId,
      resource: "auth",
    });

    return { token, sessionId: session.id };
  }

  async logout(token: string, correlationId = randomUUID()) {
    const session = await this.repository.findActiveSession(this.tokens.hash(token));
    await this.repository.revokeSession(this.tokens.hash(token));
    await this.audit.record({
      eventType: "LOGOUT",
      outcome: SecurityAuditOutcome.SUCCESS,
      actorUserId: session?.userId,
      targetUserId: session?.userId,
      sessionId: session?.id,
      correlationId,
      resource: "auth",
    });
  }

  async validateSession(token: string) {
    const session = await this.repository.findActiveSession(this.tokens.hash(token));
    if (
      !session ||
      session.status !== AuthSessionStatus.ACTIVE ||
      session.expiresAt <= new Date() ||
      !this.repository.isActive(session.user.status)
    ) {
      throw new UnauthorizedException("Invalid session");
    }
    const activeMembership = session.user.teamMemberships.find(
      (entry) => entry.status === "ACTIVE",
    );

    return {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      status: session.user.status,
      sessionId: session.id,
      roles: session.user.roleAssignments
        .filter((entry) => entry.status === "ACTIVE")
        .map((entry) => entry.roleCode),
      hasReviewerAccess: session.user.reviewerAssignments.some(
        (entry) => entry.status === "ACTIVE",
      ),
      activeTeam: activeMembership
        ? {
            id: activeMembership.team.id,
            name: activeMembership.team.name,
            status: activeMembership.team.status,
          }
        : undefined,
    };
  }
}
