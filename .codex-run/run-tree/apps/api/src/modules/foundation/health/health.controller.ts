import { Controller, Get, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { HealthService } from "./health.service.js";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get("live")
  live() {
    return this.health.live();
  }

  @Get("ready")
  async ready(@Res({ passthrough: true }) reply: FastifyReply) {
    const readiness = await this.health.ready();
    if (readiness.status !== "UP") {
      reply.status(503);
    }
    return readiness;
  }
}
