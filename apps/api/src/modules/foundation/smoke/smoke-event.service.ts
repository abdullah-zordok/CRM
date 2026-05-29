import { BadRequestException, Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { EventBusService } from "../../../infrastructure/events/event-bus.service.js";
import { foundationSmokeEventName } from "../../../infrastructure/events/event-types.js";
import { FoundationSmokeQueue } from "../../../infrastructure/queues/foundation-smoke.queue.js";
import { JobStatusRepository } from "../../../infrastructure/queues/job-status.repository.js";

@Injectable()
export class SmokeEventService {
  constructor(
    private readonly events: EventBusService,
    private readonly queue: FoundationSmokeQueue,
    private readonly jobs: JobStatusRepository,
  ) {}

  async trigger(input: { requestedBy: string; correlationId: string }) {
    if (input.requestedBy.toLowerCase().includes("lead")) {
      throw new BadRequestException("CRM business data is not allowed in foundation smoke events");
    }

    const event = await this.events.record({
      name: foundationSmokeEventName,
      version: 1,
      payload: { requestedBy: input.requestedBy, requestedAt: new Date().toISOString() },
      correlationId: input.correlationId,
    });
    const idempotencyKey = createHash("sha256")
      .update(`${event.id}:${input.correlationId}`)
      .digest("hex");
    const job = await this.jobs.createQueued({
      operationalEventId: event.id,
      queueName: "foundation-smoke",
      jobType: "FOUNDATION_SMOKE_JOB",
      idempotencyKey,
      correlationId: input.correlationId,
      maxAttempts: 3,
    });
    await this.queue.add(job.id, { eventId: event.id, correlationId: input.correlationId });

    return {
      eventId: event.id,
      jobId: job.id,
      status: "QUEUED",
      correlationId: input.correlationId,
    };
  }

  findJob(jobId: string) {
    return this.jobs.findById(jobId);
  }
}
