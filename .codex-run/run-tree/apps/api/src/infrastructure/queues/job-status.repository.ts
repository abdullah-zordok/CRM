import { Injectable } from "@nestjs/common";
import { BackgroundJobStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class JobStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  createQueued(input: {
    operationalEventId: string;
    queueName: string;
    jobType: string;
    idempotencyKey: string;
    correlationId: string;
    maxAttempts: number;
  }) {
    return this.prisma.backgroundJob.create({
      data: {
        operationalEventId: input.operationalEventId,
        queueName: input.queueName,
        jobType: input.jobType,
        idempotencyKey: input.idempotencyKey,
        correlationId: input.correlationId,
        maxAttempts: input.maxAttempts,
        status: BackgroundJobStatus.QUEUED,
      },
    });
  }

  findById(id: string) {
    return this.prisma.backgroundJob.findUnique({ where: { id } });
  }

  markCompleted(id: string) {
    return this.prisma.backgroundJob.update({
      where: { id },
      data: { status: BackgroundJobStatus.COMPLETED, completedAt: new Date() },
    });
  }

  markFailed(id: string, error: string) {
    return this.prisma.backgroundJob.update({
      where: { id },
      data: { status: BackgroundJobStatus.FAILED, lastError: error },
    });
  }
}
