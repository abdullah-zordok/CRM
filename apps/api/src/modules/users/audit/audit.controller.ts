import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { PermissionCode } from "../permissions/permission-codes.js";
import { auditSearchSchema } from "../users.schemas.js";
import { AuditSearchService } from "./audit-search.service.js";

@Controller("audit")
@UseGuards(SessionGuard, RoleGuard)
export class AuditController {
  constructor(private readonly auditSearch: AuditSearchService) {}

  @Get("security")
  @RequirePermission(PermissionCode.AuditRead)
  search(@Query() query: Record<string, string>, @Req() request: AuthenticatedRequest) {
    return this.auditSearch.search(auditSearchSchema.parse(query), request.user?.id);
  }
}
