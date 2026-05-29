import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { RedisService } from "../cache/redis.service.js";

export const foundationSmokeQueueName = "foundation-smoke";

@Injectable()
export class FoundationSmokeQueue {
  readonly queue: Queue;

  constructor(redis: RedisService) {
    this.queue = new Queue(foundationSmokeQueueName, {
      connection: redis.client,
    });
  }

  add(jobId: string, data: Record<string, unknown>) {
    return this.queue.add("FOUNDATION_SMOKE_JOB", data, {
      jobId,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }
}
