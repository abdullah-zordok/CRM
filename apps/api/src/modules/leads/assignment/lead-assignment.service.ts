import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { UsersRepository } from "../../users/users.repository.js";
import { LeadAuditService } from "../audit/lead-audit.service.js";
import { LeadEventService } from "../events/lead-event.service.js";
import { LeadErrorCode, toLeadDetailDto } from "../leads.dto.js";
import { LeadRepository } from "../leads.repository.js";
import type { AssignLeadInput } from "../leads.schemas.js";
import { LeadAccessService } from "../permissions/lead-access.service.js";
import { LeadAssignmentRepository } from "./lead-assignment.repository.js";

type LeadUser = AuthenticatedRequest["user"];

export function isEligibleLeadAssignee(user: { status: string; roles: string[] } | undefined) {
  return Boolean(user?.status === "ACTIVE" && user.roles.includes("SALES_REPRESENTATIVE"));
}

@Injectable()
export class LeadAssignmentService {
  constructor(
    private readonly leads: LeadRepository,
    private readonly assignments: LeadAssignmentRepository,
    private readonly access: LeadAccessService,
    private readonly users: UsersRepository,
    private readonly audit: LeadAuditService,
    private readonly events: LeadEventService,
  ) {}

  async assign(leadId: string, input: AssignLeadInput, user: LeadUser, correlationId = "local") {
    const lead = await this.leads.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");

    const decision = await this.access.decide({ user, lead, action: "ASSIGN", correlationId });
    if (!decision.allowed || !user) {
      await this.audit.record({
        eventType: "LEAD_ASSIGNMENT_DENIED",
        outcome: "DENIED",
        actorUserId: user?.id,
        leadId,
        correlationId,
        metadata: { reason: decision.reason },
      });
      throw new ForbiddenException("Permission denied");
    }

    const assignee = await this.users.findUser(input.ownerUserId);
    if (!isEligibleLeadAssignee(assignee)) {
      throw new ConflictException({
        code: LeadErrorCode.IneligibleAssignee,
        message: "Lead assignee is not eligible",
      });
    }

    const assigneeMembership = await this.users.activeMembershipForUser(input.ownerUserId);
    if (user.roles.includes("MANAGER") && assigneeMembership?.team.id !== user.activeTeam?.id) {
      throw new ForbiddenException("Permission denied");
    }

    const updated = await this.assignments.assign({
      leadId,
      version: input.version,
      fromUserId: lead.ownerUserId,
      toUserId: input.ownerUserId,
      fromTeamId: lead.teamId,
      toTeamId: assigneeMembership?.team.id,
      assignedByUserId: user.id,
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
      eventType: "LEAD_ASSIGNED",
      actorUserId: user.id,
      leadId,
      correlationId,
      metadata: { fromUserId: lead.ownerUserId, toUserId: input.ownerUserId },
    });
    await this.events.record({
      name: "LeadAssigned",
      leadId,
      payload: { leadId, fromUserId: lead.ownerUserId, toUserId: input.ownerUserId },
      idempotencyKey: `lead-assigned:${leadId}:${updated.version}`,
      correlationId,
    });

    return toLeadDetailDto(updated, correlationId);
  }
}
