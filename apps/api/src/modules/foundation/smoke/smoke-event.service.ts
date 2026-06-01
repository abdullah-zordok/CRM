import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EventBusService } from "../../../infrastructure/events/event-bus.service.js";
import { foundationSmokeEventName } from "../../../infrastructure/events/event-types.js";
import { FoundationSmokeQueue } from "../../../infrastructure/queues/foundation-smoke.queue.js";

@Injectable()
export class SmokeEventService {
  constructor(
    private readonly events: EventBusService,
    private readonly queue: FoundationSmokeQueue,
  ) {}

  async trigger(requestedBy: string, correlationId = randomUUID()) {
    if (requestedBy.toLowerCase().includes("lead") || requestedBy.toLowerCase().includes("deal")) {
      throw new BadRequestException("Smoke event cannot contain CRM business data");
    }

    const idempotencyKey = `foundation-smoke:${correlationId}`;
    const event = await this.events.record({
      name: foundationSmokeEventName,
      payload: {
        requestedBy,
        requestedAt: new Date().toISOString(),
      },
      idempotencyKey,
      correlationId,
    });
    const job = await this.queue.enqueue({
      operationalEventId: event.id,
      idempotencyKey: `${idempotencyKey}:job`,
      correlationId,
    });

    return {
      eventId: event.id,
      jobId: job.id,
      status: job.status,
      correlationId,
    };
  }
}
