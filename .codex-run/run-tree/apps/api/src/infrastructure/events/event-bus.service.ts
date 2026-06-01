import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { OperationalEventStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class EventBusService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    name: string;
    version: number;
    payload: Record<string, unknown>;
    correlationId: string;
  }) {
    return this.prisma.operationalEvent.create({
      data: {
        name: input.name,
        version: input.version,
        payload: input.payload as Prisma.InputJsonValue,
        correlationId: input.correlationId,
        status: OperationalEventStatus.RECORDED,
      },
    });
  }

  markHandled(id: string) {
    return this.prisma.operationalEvent.update({
      where: { id },
      data: { status: OperationalEventStatus.HANDLED, handledAt: new Date() },
    });
  }
}
