import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { SessionGuard } from "../../../common/guards/session.guard.js";
import { getCorrelationId } from "../../../common/middleware/correlation.middleware.js";

@Controller("foundation/protected-shell")
@UseGuards(SessionGuard)
export class ProtectedShellController {
  @Get("access")
  access(@Req() request: AuthenticatedRequest) {
    return {
      decision: "ALLOW",
      resource: "foundation.protected-shell",
      action: "access",
      reason: "AUTHENTICATED_SESSION",
      correlationId: getCorrelationId(request),
      decidedAt: new Date().toISOString(),
    };
  }
}
