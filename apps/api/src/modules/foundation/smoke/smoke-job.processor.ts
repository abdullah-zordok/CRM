import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { BackgroundJobStatus } from "@prisma/client";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { RedisService } from "../../../infrastructure/cache/redis.service.js";
import { foundationSmokeQueueName } from "../../../infrastructure/queues/foundation-smoke.queue.js";
import { JobStatusRepository } from "../../../infrastructure/queues/job-status.repository.js";

type SmokeJobData = {
  jobId: string;
};

@Injectable()
export class SmokeJobProcessor implements OnModuleInit, OnModuleDestroy {
  private worker?: Worker<SmokeJobData>;

  constructor(
    private readonly redis: RedisService,
    private readonly jobs: JobStatusRepository,
  ) {}

  onModuleInit(): void {
    this.worker = new Worker<SmokeJobData>(foundationSmokeQueueName, (job) => this.process(job), {
      connection: this.redis.createQueueConnection(),
    });

    this.worker.on("failed", (job, error) => {
      void this.recordFailure(job, error);
    });
    this.worker.on("error", () => {
      // Readiness reports Redis/queue health; the worker should not crash the API process.
    });
  }

  async process(job: Job<SmokeJobData>): Promise<void> {
    const attempts = job.attemptsMade + 1;
    await this.jobs.update(job.data.jobId, BackgroundJobStatus.RUNNING, {
      attempts,
      startedAt: new Date(),
      lastError: null,
    });

    await this.jobs.update(job.data.jobId, BackgroundJobStatus.COMPLETED, {
      attempts,
      completedAt: new Date(),
      lastError: null,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }

  private async recordFailure(job: Job<SmokeJobData> | undefined, error: Error): Promise<void> {
    if (!job) return;
    const attempts = job.attemptsMade;
    const maxAttempts = Number(job.opts.attempts ?? 1);
    await this.jobs.update(
      job.data.jobId,
      attempts >= maxAttempts ? BackgroundJobStatus.FAILED : BackgroundJobStatus.RETRYING,
      {
        attempts,
        lastError: error.message,
      },
    );
  }
}
