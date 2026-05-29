import { Injectable } from "@nestjs/common";
import type { SecurityAuditEventType, SecurityAuditOutcome } from "@prisma/client";
import { SecurityAuditRepository } from "./security-audit.repository.js";

@Injectable()
export class SecurityAuditService {
  constructor(private readonly repository: SecurityAuditRepository) {}

  record(
    eventType: SecurityAuditEventType,
    outcome: SecurityAuditOutcome,
    correlationId: string,
    metadata: Record<string, unknown> = {},
  ) {
    return this.repository.create({
      eventType,
      outcome,
      correlationId,
      metadata: this.sanitize(metadata),
    });
  }

  private sanitize(metadata: Record<string, unknown>) {
    const clone = { ...metadata };
    delete clone.password;
    delete clone.token;
    delete clone.sessionToken;
    delete clone.passwordHash;
    return clone;
  }
}
