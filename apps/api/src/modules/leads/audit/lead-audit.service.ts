import { Injectable } from "@nestjs/common";
import { SecurityAuditOutcome, type Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import { sanitizeLeadMetadata } from "../leads.dto.js";

@Injectable()
export class LeadAuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    eventType: string;
    outcome?: SecurityAuditOutcome;
    actorUserId?: string;
    leadId?: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.securityAuditRecord.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome ?? SecurityAuditOutcome.SUCCESS,
        actorUserId: input.actorUserId,
        resource: input.leadId ? `lead:${input.leadId}` : "lead",
        correlationId: input.correlationId,
        metadata: sanitizeLeadMetadata(input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
