import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { RequirePermission } from "../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../users/permissions/permission-codes.js";
import { OperationsDashboardService } from "./operations-dashboard.service.js";
import {
  operationsDashboardQuerySchema,
  type OperationsDashboardQueryInput,
} from "./operations-dashboard.schemas.js";

@Controller("dashboard")
@UseGuards(SessionGuard, RoleGuard)
export class OperationsDashboardController {
  constructor(private readonly dashboard: OperationsDashboardService) {}

  @Get("operations")
  @RequirePermission(PermissionCode.DashboardOperationsView)
  operations(
    @Query(new ZodValidationPipe(operationsDashboardQuerySchema))
    query: OperationsDashboardQueryInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dashboard.getOperations(request.user, query);
  }
}
