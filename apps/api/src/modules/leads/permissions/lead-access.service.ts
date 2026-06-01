import { Injectable } from "@nestjs/common";
import { AccessDecisionValue } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import type { LeadAccessScope, LeadAction } from "../leads.types.js";

type LeadUser = NonNullable<AuthenticatedRequest["user"]>;

@Injectable()
export class LeadAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async decide(input: {
    user?: LeadUser;
    lead?: { id: string; ownerUserId: string; teamId: string | null };
    action: LeadAction;
    correlationId: string;
  }): Promise<{ allowed: boolean; scope: LeadAccessScope; reason: string }> {
    const result = this.evaluate(input.user, input.lead, input.action);
    await this.prisma.leadAccessDecision.create({
      data: {
        userId: input.user?.id,
        leadId: input.lead?.id,
        action: input.action,
        decision: result.allowed ? AccessDecisionValue.ALLOW : AccessDecisionValue.DENY,
        reason: result.reason,
        scope: result.scope,
        correlationId: input.correlationId,
      },
    });
    return result;
  }

  evaluate(
    user: LeadUser | undefined,
    lead: { ownerUserId: string; teamId: string | null } | undefined,
    action: LeadAction,
  ): { allowed: boolean; scope: LeadAccessScope; reason: string } {
    if (!user || user.status !== "ACTIVE") {
      return { allowed: false, scope: "NONE", reason: "USER_INACTIVE" };
    }

    if (user.roles.includes("ADMIN")) {
      return { allowed: true, scope: "GLOBAL", reason: "ADMIN_GLOBAL_SCOPE" };
    }

    if (user.roles.includes("MANAGER")) {
      const teamId = user.activeTeam?.id;
      const teamScoped = !lead || (teamId && lead.teamId === teamId);
      if (teamScoped) return { allowed: true, scope: "TEAM", reason: "MANAGER_TEAM_SCOPE" };
    }

    if (user.roles.includes("SALES_REPRESENTATIVE")) {
      if (action === "CREATE" || action === "SEARCH") {
        return { allowed: true, scope: "OWNED", reason: "SALES_REP_SCOPE" };
      }
      if (lead?.ownerUserId === user.id && action !== "ASSIGN") {
        return { allowed: true, scope: "OWNED", reason: "LEAD_OWNER_SCOPE" };
      }
    }

    return { allowed: false, scope: "NONE", reason: "DEFAULT_DENY" };
  }
}
