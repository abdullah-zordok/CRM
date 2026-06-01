import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import type { LeadStatus as PrismaLeadStatus, LeadStatusChangeType } from "@prisma/client";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { LeadAuditService } from "../audit/lead-audit.service.js";
import { LeadEventService } from "../events/lead-event.service.js";
import { LeadErrorCode, toLeadDetailDto } from "../leads.dto.js";
import { LeadRepository } from "../leads.repository.js";
import type { ChangeLeadStatusInput } from "../leads.schemas.js";
import type { LeadStatus } from "../leads.types.js";
import { LeadAccessService } from "../permissions/lead-access.service.js";
import { LeadStatusRepository } from "./lead-status.repository.js";

type LeadUser = AuthenticatedRequest["user"];

const NORMAL_FLOW: Partial<Record<LeadStatus, LeadStatus[]>> = {
  NEW: ["CONTACTED"],
  CONTACTED: ["QUALIFIED"],
  QUALIFIED: ["NEGOTIATION"],
  NEGOTIATION: ["WON", "LOST"],
};

export function resolveStatusChangeType(input: {
  roles: string[];
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
}): LeadStatusChangeType | null {
  const privileged = input.roles.includes("ADMIN") || input.roles.includes("MANAGER");
  if (input.toStatus === "ARCHIVED") return privileged ? "ARCHIVE" : null;
  if (input.fromStatus === "ARCHIVED") return privileged ? "RESTORE" : null;
  if (NORMAL_FLOW[input.fromStatus]?.includes(input.toStatus)) return "NORMAL_FLOW";
  return privileged ? "CORRECTION" : null;
}

@Injectable()
export class LeadStatusService {
  constructor(
    private readonly leads: LeadRepository,
    private readonly statuses: LeadStatusRepository,
    private readonly access: LeadAccessService,
    private readonly audit: LeadAuditService,
    private readonly events: LeadEventService,
  ) {}

  async changeStatus(
    leadId: string,
    input: ChangeLeadStatusInput,
    user: LeadUser,
    correlationId = "local",
  ) {
    const lead = await this.leads.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");

    const decision = await this.access.decide({
      user,
      lead,
      action: "CHANGE_STATUS",
      correlationId,
    });
    if (!decision.allowed || !user) throw new ForbiddenException("Permission denied");

    const changeType = resolveStatusChangeType({
      roles: user.roles,
      fromStatus: lead.status,
      toStatus: input.status,
    });
    if (!changeType) {
      throw new ConflictException({
        code: LeadErrorCode.InvalidStatusTransition,
        message: "Lead status transition is not allowed",
      });
    }

    const updated = await this.statuses.changeStatus({
      leadId,
      version: input.version,
      fromStatus: lead.status as PrismaLeadStatus,
      toStatus: input.status as PrismaLeadStatus,
      changeType,
      changedByUserId: user.id,
      reason: input.reason,
      correlationId,
    });
    if (!updated) {
      await this.audit.record({
        eventType: "LEAD_STALE_UPDATE_REJECTED",
        outcome: "DENIED",
        actorUserId: user.id,
        leadId,
        correlationId,
        metadata: { expectedVersion: input.version },
      });
      throw new PreconditionFailedException({
        code: LeadErrorCode.StaleUpdate,
        message: "Lead has changed. Reload and try again.",
      });
    }

    await this.audit.record({
      eventType: "LEAD_STATUS_CHANGED",
      actorUserId: user.id,
      leadId,
      correlationId,
      metadata: { fromStatus: lead.status, toStatus: input.status, changeType },
    });
    await this.events.record({
      name: "LeadStatusChanged",
      leadId,
      payload: { leadId, fromStatus: lead.status, toStatus: input.status, changeType },
      idempotencyKey: `lead-status:${leadId}:${updated.version}`,
      correlationId,
    });

    return toLeadDetailDto(updated, correlationId);
  }
}
