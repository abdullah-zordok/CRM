import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class EventBusService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    name: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
    correlationId: string;
  }) {
    return this.prisma.operationalEvent.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: {},
      create: {
        name: input.name,
        payload: input.payload as Prisma.InputJsonValue,
        idempotencyKey: input.idempotencyKey,
        correlationId: input.correlationId,
      },
    });
  }
}
