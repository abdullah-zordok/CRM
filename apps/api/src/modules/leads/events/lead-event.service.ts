import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import { sanitizeLeadMetadata } from "../leads.dto.js";
import type { LeadDomainEventName } from "../leads.types.js";

@Injectable()
export class LeadEventService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    name: LeadDomainEventName;
    leadId: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
    correlationId: string;
  }) {
    return this.prisma.leadDomainEvent.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: {},
      create: {
        name: input.name,
        leadId: input.leadId,
        payload: sanitizeLeadMetadata(input.payload) as Prisma.InputJsonValue,
        idempotencyKey: input.idempotencyKey,
        correlationId: input.correlationId,
      },
    });
  }
}
