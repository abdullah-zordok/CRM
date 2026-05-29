import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { type SecurityAuditEventType, type SecurityAuditOutcome } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";

@Injectable()
export class SecurityAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    eventType: SecurityAuditEventType;
    outcome: SecurityAuditOutcome;
    correlationId: string;
    actorUserId?: string | null;
    sessionId?: string | null;
    resource?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.securityAuditRecord.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome,
        correlationId: input.correlationId,
        actorUserId: input.actorUserId,
        sessionId: input.sessionId,
        resource: input.resource,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
