import { Injectable } from "@nestjs/common";
import { AccessDecisionValue } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type { ExhibitionAction, ExhibitionAccessScope } from "./exhibition.types.js";
import type { AuthenticatedRequest } from "../../common/guards/session.guard.js";

type ExhibitionUser = NonNullable<AuthenticatedRequest["user"]>;

@Injectable()
export class ExhibitionAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async decide(input: {
    user?: ExhibitionUser;
    exhibition?: { id: string; ownerUserId: string; teamId: string | null };
    lead?: { id: string; ownerUserId: string; teamId: string | null };
    attendeeUserIds?: string[];
    action: ExhibitionAction;
    correlationId: string;
  }): Promise<{ allowed: boolean; scope: ExhibitionAccessScope; reason: string }> {
    const result = this.evaluate(
      input.user,
      input.exhibition,
      input.lead,
      input.attendeeUserIds,
      input.action,
    );
    await this.prisma.exhibitionAccessDecision.create({
      data: {
        userId: input.user?.id,
        exhibitionId: input.exhibition?.id,
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
    user: ExhibitionUser | undefined,
    exhibition: { ownerUserId: string; teamId: string | null } | undefined,
    lead: { ownerUserId: string; teamId: string | null } | undefined,
    attendeeUserIds: string[] | undefined,
    action: ExhibitionAction,
  ): { allowed: boolean; scope: ExhibitionAccessScope; reason: string } {
    if (!user || user.status !== "ACTIVE") {
      return { allowed: false, scope: "NONE", reason: "USER_INACTIVE" };
    }

    if (user.roles.includes("ADMIN")) {
      return { allowed: true, scope: "GLOBAL", reason: "ADMIN_GLOBAL_SCOPE" };
    }

    if (user.roles.includes("MANAGER")) {
      const teamId = user.activeTeam?.id;
      const teamScoped = !exhibition || (teamId && exhibition.teamId === teamId);
      if (teamScoped) return { allowed: true, scope: "TEAM", reason: "MANAGER_TEAM_SCOPE" };
    }

    if (user.roles.includes("SALES_REPRESENTATIVE")) {
      if (action === "SEARCH") {
        return { allowed: true, scope: "OWNED_LEAD", reason: "SALES_REP_SCOPE" };
      }

      if (action === "CONFIRM_ATTENDANCE") {
        if (attendeeUserIds?.includes(user.id)) {
          return { allowed: true, scope: "ATTENDEE", reason: "ATTENDEE_SCOPE" };
        }
      }

      if (action === "VIEW" || action === "ATTRIBUTE_LEAD") {
        if (attendeeUserIds?.includes(user.id)) {
          return { allowed: true, scope: "ATTENDEE", reason: "ATTENDEE_SCOPE" };
        }
        if (lead?.ownerUserId === user.id) {
          return { allowed: true, scope: "OWNED_LEAD", reason: "LEAD_OWNER_SCOPE" };
        }
      }
    }

    return { allowed: false, scope: "NONE", reason: "DEFAULT_DENY" };
  }
}
