import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type { ExhibitionDomainEventName } from "./exhibition.types.js";

@Injectable()
export class ExhibitionEventService {
  constructor(private readonly prisma: PrismaService) {}

  async emit(input: {
    name: ExhibitionDomainEventName;
    exhibitionId: string;
    leadId?: string;
    attendeeUserId?: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
    correlationId: string;
  }): Promise<void> {
    await this.prisma.exhibitionDomainEvent.create({
      data: {
        name: input.name,
        exhibitionId: input.exhibitionId,
        leadId: input.leadId,
        attendeeUserId: input.attendeeUserId,
        payload: input.payload as Prisma.InputJsonValue,
        idempotencyKey: input.idempotencyKey,
        correlationId: input.correlationId,
      },
    });
  }
}
