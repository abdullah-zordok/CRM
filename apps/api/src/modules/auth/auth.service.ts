import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthSessionStatus, SecurityAuditEventType, SecurityAuditOutcome } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { AuthRepository } from "./auth.repository.js";
import { PasswordService } from "./security/password.service.js";
import { SessionTokenService } from "./security/session-token.service.js";
import { SecurityAuditService } from "./audit/security-audit.service.js";

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
    if (!user || !this.repository.isActive(user.status)) {
      await this.audit.record(
        SecurityAuditEventType.LOGIN_FAILURE,
        SecurityAuditOutcome.FAILURE,
        correlationId,
        { email },
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await this.passwords.verify(user.passwordHash, password);
    if (!ok) {
      await this.audit.record(
        SecurityAuditEventType.LOGIN_FAILURE,
        SecurityAuditOutcome.FAILURE,
        correlationId,
        { email },
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.tokens.createToken();
    const session = await this.repository.createSession(
      user.id,
      this.tokens.hash(token),
      new Date(Date.now() + sessionTtlMs),
    );
    await this.audit.record(
      SecurityAuditEventType.LOGIN_SUCCESS,
      SecurityAuditOutcome.SUCCESS,
      correlationId,
      {
        userId: user.id,
        sessionId: session.id,
      },
    );

    return { token, sessionId: session.id };
  }

  async logout(token: string, correlationId = randomUUID()) {
    await this.repository.revokeSession(this.tokens.hash(token));
    await this.audit.record(
      SecurityAuditEventType.LOGOUT,
      SecurityAuditOutcome.SUCCESS,
      correlationId,
    );
  }

  async validateSession(token: string) {
    const session = await this.repository.findActiveSession(this.tokens.hash(token));
    if (
      !session ||
      session.status !== AuthSessionStatus.ACTIVE ||
      session.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException("Invalid session");
    }

    return {
      id: session.user.id,
      email: session.user.email,
      sessionId: session.id,
      roles: session.user.roles.map((entry) => entry.role.code),
    };
  }
}
