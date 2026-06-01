import type { OnModuleDestroy } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { BackgroundJob } from "@prisma/client";
import { BackgroundJobStatus } from "@prisma/client";
import { Queue } from "bullmq";
import { RedisService } from "../cache/redis.service.js";
import { JobStatusRepository } from "./job-status.repository.js";

export const foundationSmokeQueueName = "foundation-smoke";
export const foundationSmokeJobName = "process-foundation-smoke";

@Injectable()
export class FoundationSmokeQueue implements OnModuleDestroy {
  private queue?: Queue<{ jobId: string }>;

  constructor(
    private readonly jobs: JobStatusRepository,
    private readonly redis: RedisService,
  ) {}

  async enqueue(input: {
    operationalEventId: string;
    idempotencyKey: string;
    correlationId: string;
  }): Promise<BackgroundJob> {
    const job = await this.jobs.create({
      operationalEventId: input.operationalEventId,
      queueName: "foundation-smoke",
      jobType: "FOUNDATION_SMOKE_JOB",
      maxAttempts: 3,
      idempotencyKey: input.idempotencyKey,
      correlationId: input.correlationId,
    });

    if (job.status !== BackgroundJobStatus.QUEUED) {
      return job;
    }

    await this.getQueue().add(
      foundationSmokeJobName,
      { jobId: job.id },
      {
        jobId: job.id,
        attempts: job.maxAttempts,
        backoff: { type: "exponential", delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return job;
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }

  private getQueue(): Queue<{ jobId: string }> {
    this.queue ??= new Queue(foundationSmokeQueueName, {
      connection: this.redis.createQueueConnection(),
    });
    return this.queue;
  }
}
