import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { SessionGuard } from "../../../common/guards/session.guard.js";
import { getCorrelationId } from "../../../common/middleware/correlation.middleware.js";
import { JobStatusRepository } from "../../../infrastructure/queues/job-status.repository.js";
import { SmokeEventService } from "./smoke-event.service.js";

@Controller("foundation")
@UseGuards(SessionGuard)
export class SmokeController {
  constructor(
    private readonly smoke: SmokeEventService,
    private readonly jobs: JobStatusRepository,
  ) {}

  @Post("smoke-events")
  async trigger(@Req() request: AuthenticatedRequest) {
    return this.smoke.trigger(request.user?.id ?? "unknown", getCorrelationId(request));
  }

  @Get("jobs/:jobId")
  async status(@Param("jobId") jobId: string) {
    const job = await this.jobs.get(jobId);
    return {
      jobId: job.id,
      jobType: job.jobType,
      status: job.status,
      attempts: job.attempts,
      maxAttempts: job.maxAttempts,
      lastError: job.lastError,
      correlationId: job.correlationId,
    };
  }
}
