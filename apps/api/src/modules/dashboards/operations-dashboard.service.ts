import { ForbiddenException, Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { AdminEventService } from "../users/admin-event.service.js";
import { UsersSecurityAuditService } from "../users/audit/users-security-audit.service.js";
import { OperationsDashboardRepository } from "./operations-dashboard.repository.js";
import type { OperationsDashboardQueryInput } from "./operations-dashboard.schemas.js";

type DashboardUser = AuthenticatedRequest["user"];

@Injectable()
export class OperationsDashboardService {
  constructor(
    private readonly repository: OperationsDashboardRepository,
    private readonly audit: UsersSecurityAuditService,
    private readonly events: AdminEventService,
  ) {}

  async getOperations(
    user: DashboardUser,
    query: OperationsDashboardQueryInput,
    correlationId = "local",
  ) {
    if (!user) throw new ForbiddenException("Permission denied");
    const scope = this.scopeFor(user);
    if (!scope) {
      await this.audit.record({
        eventType: "DASHBOARD_METRICS_DENIED",
        outcome: "DENIED",
        actorUserId: user.id,
        resource: "dashboard",
        metadata: { reason: "ROLE_NOT_ALLOWED" },
        correlationId,
      });
      throw new ForbiddenException("Permission denied");
    }

    const dashboard = await this.repository.overview({
      leadWhere: scope.leadWhere,
      userWhere: scope.userWhere,
      query,
    });
    await this.audit.record({
      eventType: "DASHBOARD_METRICS_VIEWED",
      actorUserId: user.id,
      resource: "dashboard",
      metadata: { scope: scope.name },
      correlationId,
    });
    this.events.record({
      name: "DashboardMetricsViewed",
      payload: { userId: user.id, scope: scope.name },
      idempotencyKey: `dashboard-metrics:${user.id}:${Date.now()}`,
      correlationId,
    });

    return {
      scope: scope.name,
      ...dashboard,
      generatedAt: new Date().toISOString(),
      correlationId,
    };
  }

  private scopeFor(user: NonNullable<DashboardUser>): {
    name: string;
    leadWhere: Prisma.LeadWhereInput;
    userWhere: Prisma.PlatformUserWhereInput;
  } | null {
    const activeUserWhere: Prisma.PlatformUserWhereInput = { status: "ACTIVE", isDeleted: false };
    if (user.roles.includes("ADMIN")) {
      return {
        name: "ADMIN_GLOBAL",
        leadWhere: {},
        userWhere: activeUserWhere,
      };
    }
    if (user.roles.includes("MANAGER") && user.activeTeam?.id) {
      return {
        name: "MANAGER_TEAM",
        leadWhere: { teamId: user.activeTeam.id },
        userWhere: {
          ...activeUserWhere,
          teamMemberships: { some: { teamId: user.activeTeam.id, status: "ACTIVE" } },
        },
      };
    }
    if (user.roles.includes("MANAGER")) {
      return {
        name: "MANAGER_TEAM",
        leadWhere: { teamId: "__no-team__" },
        userWhere: { ...activeUserWhere, id: "__no-user__" },
      };
    }
    return null;
  }
}
