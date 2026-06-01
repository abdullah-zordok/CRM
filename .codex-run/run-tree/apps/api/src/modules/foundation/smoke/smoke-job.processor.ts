import { Injectable } from "@nestjs/common";
import { JobStatusRepository } from "../../../infrastructure/queues/job-status.repository.js";
import { EventBusService } from "../../../infrastructure/events/event-bus.service.js";

@Injectable()
export class SmokeJobProcessor {
  constructor(
    private readonly jobs: JobStatusRepository,
    private readonly events: EventBusService,
  ) {}

  async handle(jobId: string, eventId: string) {
    await this.jobs.markCompleted(jobId);
    await this.events.markHandled(eventId);
  }

  async fail(jobId: string, error: string) {
    await this.jobs.markFailed(jobId, error);
  }
}
