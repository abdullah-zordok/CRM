import { Controller, Get, UseGuards } from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard } from "../../../common/guards/session.guard.js";
import { PermissionCode } from "./permission-codes.js";
import { PermissionService } from "./permission.service.js";

@Controller("permissions")
@UseGuards(SessionGuard, RoleGuard)
export class PermissionsController {
  constructor(private readonly permissions: PermissionService) {}

  @Get("matrix")
  @RequirePermission(PermissionCode.PermissionsRead)
  matrix() {
    return { ...this.permissions.matrix(), correlationId: "local" };
  }
}
