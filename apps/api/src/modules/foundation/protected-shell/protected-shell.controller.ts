import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { Roles } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard } from "../../../common/guards/session.guard.js";
import { getCorrelationId } from "../../../common/middleware/correlation.middleware.js";

@Controller("foundation/protected-shell")
@UseGuards(SessionGuard, RoleGuard)
export class ProtectedShellController {
  @Get("access")
  @Roles("ADMIN")
  access(@Req() request: FastifyRequest) {
    return {
      decision: "ALLOW",
      resource: "foundation.protected-shell",
      action: "read",
      reason: "ROLE_ALLOWED",
      correlationId: getCorrelationId(request),
      decidedAt: new Date().toISOString(),
    };
  }
}
