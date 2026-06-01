import { Module } from "@nestjs/common";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard } from "../../common/guards/session.guard.js";
import { AuthModule } from "../auth/auth.module.js";
import { ActivationController } from "./activation/activation.controller.js";
import { ActivationService } from "./activation/activation.service.js";
import { AdminEventService } from "./admin-event.service.js";
import { AuditController } from "./audit/audit.controller.js";
import { AuditSearchRepository } from "./audit/audit-search.repository.js";
import { AuditSearchService } from "./audit/audit-search.service.js";
import { UsersSecurityAuditService } from "./audit/users-security-audit.service.js";
import { PermissionService } from "./permissions/permission.service.js";
import { PermissionsController } from "./permissions/permissions.controller.js";
import { ReviewerAccessService } from "./permissions/reviewer-access.service.js";
import { RoleAssignmentService } from "./permissions/role-assignment.service.js";
import { RolesController } from "./permissions/roles.controller.js";
import { TeamMembershipService } from "./teams/team-membership.service.js";
import { TeamService } from "./teams/team.service.js";
import { TeamsController } from "./teams/teams.controller.js";
import { UsersController } from "./users.controller.js";
import { UsersRepository } from "./users.repository.js";
import { UsersService } from "./users.service.js";

export const usersRbacObservability = {
  logFields: ["actorUserId", "targetUserId", "permissionCode", "teamId", "correlationId"],
  counters: [
    "users.created",
    "users.disabled",
    "roles.changed",
    "teams.changed",
    "sessions.revoked",
    "audit.viewed",
    "access.denied",
  ],
};

@Module({
  imports: [AuthModule],
  controllers: [
    UsersController,
    ActivationController,
    RolesController,
    PermissionsController,
    TeamsController,
    AuditController,
  ],
  providers: [
    UsersRepository,
    UsersService,
    ActivationService,
    PermissionService,
    RoleAssignmentService,
    ReviewerAccessService,
    TeamService,
    TeamMembershipService,
    UsersSecurityAuditService,
    AuditSearchRepository,
    AuditSearchService,
    AdminEventService,
    SessionGuard,
    RoleGuard,
  ],
  exports: [UsersRepository, UsersService, PermissionService],
})
export class UsersModule {}
