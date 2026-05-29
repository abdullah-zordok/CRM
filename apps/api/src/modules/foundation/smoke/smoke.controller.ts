import { Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { Roles } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { getCorrelationId } from "../../../common/middleware/correlation.middleware.js";
import { SmokeEventService } from "./smoke-event.service.js";

@Controller("foundation")
@UseGuards(SessionGuard, RoleGuard)
export class SmokeController {
  constructor(private readonly smoke: SmokeEventService) {}

  @Post("smoke-events")
  @Roles("ADMIN")
  trigger(@Req() request: AuthenticatedRequest & FastifyRequest) {
    return this.smoke.trigger({
      requestedBy: request.user?.email ?? "unknown",
      correlationId: getCorrelationId(request),
    });
  }

  @Get("jobs/:jobId")
  @Roles("ADMIN")
  async status(@Param("jobId") jobId: string) {
    const job = await this.smoke.findJob(jobId);
    if (!job) throw new NotFoundException("Job not found");
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
