import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type { SecurityAuditOutcome, ExhibitionHistoryEntryType } from "@prisma/client";
import { redactMetadata } from "../users/users.dto.js";

@Injectable()
export class ExhibitionAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logHistory(input: {
    exhibitionId: string;
    entryType: ExhibitionHistoryEntryType;
    actorUserId?: string;
    leadId?: string;
    attendeeUserId?: string;
    summary: string;
    metadata?: Record<string, unknown>;
    correlationId: string;
  }): Promise<void> {
    await this.prisma.exhibitionHistoryEntry.create({
      data: {
        exhibitionId: input.exhibitionId,
        entryType: input.entryType,
        actorUserId: input.actorUserId,
        leadId: input.leadId,
        attendeeUserId: input.attendeeUserId,
        summary: input.summary,
        metadata: redactMetadata(input.metadata ?? {}) as Prisma.InputJsonValue,
        correlationId: input.correlationId,
      },
    });
  }

  async logSecurity(input: {
    eventType: string;
    actorUserId?: string;
    targetUserId?: string;
    resource?: string;
    outcome: SecurityAuditOutcome;
    ipAddress?: string;
    userAgent?: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.prisma.securityAuditRecord.create({
      data: {
        eventType: input.eventType,
        actorUserId: input.actorUserId,
        targetUserId: input.targetUserId,
        resource: input.resource,
        outcome: input.outcome,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        correlationId: input.correlationId,
        metadata: redactMetadata(input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
