import { Injectable } from "@nestjs/common";
import { SecurityAuditOutcome, type ActivityAuditType, type Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import { sanitizeLeadMetadata } from "../leads.dto.js";

@Injectable()
export class ActivityAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    eventType: ActivityAuditType;
    outcome?: SecurityAuditOutcome;
    activityId?: string;
    leadId?: string;
    actorUserId?: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    const metadata = sanitizeLeadMetadata(input.metadata ?? {}) as Prisma.InputJsonValue;
    await this.prisma.activityAuditEntry.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome ?? SecurityAuditOutcome.SUCCESS,
        activityId: input.activityId,
        leadId: input.leadId,
        actorUserId: input.actorUserId,
        correlationId: input.correlationId,
        metadata,
      },
    });
    await this.prisma.securityAuditRecord.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome ?? SecurityAuditOutcome.SUCCESS,
        actorUserId: input.actorUserId,
        resource: input.activityId ? `activity:${input.activityId}` : "activity",
        correlationId: input.correlationId,
        metadata,
      },
    });
  }
}
