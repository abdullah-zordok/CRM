import { Injectable, NotFoundException } from "@nestjs/common";
import type { BackgroundJobStatus } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class JobStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    operationalEventId?: string;
    queueName: string;
    jobType: string;
    maxAttempts: number;
    idempotencyKey: string;
    correlationId: string;
  }) {
    return this.prisma.backgroundJob.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: {},
      create: input,
    });
  }

  update(jobId: string, status: BackgroundJobStatus, extra: Record<string, unknown> = {}) {
    return this.prisma.backgroundJob.update({
      where: { id: jobId },
      data: {
        status,
        ...extra,
      },
    });
  }

  async get(jobId: string) {
    const job = await this.prisma.backgroundJob.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException("Job not found");
    }
    return job;
  }
}
