import { Controller, Get, HttpCode, Res } from "@nestjs/common";
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
  @HttpCode(200)
  async ready(@Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.health.ready();
    if (result.status !== "UP") {
      reply.status(503);
    }
    return result;
  }
}
