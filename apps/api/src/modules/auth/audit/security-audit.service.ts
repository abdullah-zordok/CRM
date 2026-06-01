import { Injectable } from "@nestjs/common";
import { SecurityAuditOutcome, type Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import { redactMetadata } from "../../users/users.dto.js";

@Injectable()
export class SecurityAuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    eventType: string;
    outcome?: SecurityAuditOutcome;
    correlationId: string;
    actorUserId?: string;
    targetUserId?: string;
    sessionId?: string;
    resource?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.securityAuditRecord.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome ?? SecurityAuditOutcome.SUCCESS,
        correlationId: input.correlationId,
        actorUserId: input.actorUserId,
        targetUserId: input.targetUserId,
        sessionId: input.sessionId,
        resource: input.resource,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: redactMetadata(input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
