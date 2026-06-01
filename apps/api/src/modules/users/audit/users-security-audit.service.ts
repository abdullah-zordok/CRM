import { Injectable } from "@nestjs/common";
import { redactMetadata } from "../users.dto.js";
import { UsersRepository } from "../users.repository.js";
import type { AuditOutcome } from "../users.types.js";

@Injectable()
export class UsersSecurityAuditService {
  constructor(private readonly repository: UsersRepository) {}

  record(input: {
    eventType: string;
    outcome?: AuditOutcome;
    actorUserId?: string;
    targetUserId?: string;
    sessionId?: string;
    resource?: string;
    correlationId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.repository.saveAudit({
      eventType: input.eventType,
      outcome: input.outcome ?? "SUCCESS",
      actorUserId: normalizeUuid(input.actorUserId),
      targetUserId: normalizeUuid(input.targetUserId),
      sessionId: normalizeUuid(input.sessionId),
      resource: input.resource,
      correlationId: input.correlationId ?? "local",
      metadata: redactMetadata(input.metadata ?? {}),
    });
  }
}

function normalizeUuid(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}
