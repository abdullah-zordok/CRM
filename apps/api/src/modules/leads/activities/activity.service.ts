import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { UsersRepository } from "../../users/users.repository.js";
import { LeadRepository } from "../leads.repository.js";
import { LeadAccessService } from "../permissions/lead-access.service.js";
import { ActivityAuditService } from "./activity-audit.service.js";
import { toActivityDetailDto, toActivitySummaryDto } from "./activity.dto.js";
import { ActivityEventService } from "./activity-event.service.js";
import { ActivityRepository, type ActivityRecord } from "./activity.repository.js";
import type {
  ActivitySearchInput,
  ActivityTimelineQueryInput,
  CancelActivityInput,
  CompleteActivityInput,
  CreateActivityInput,
  ReassignActivityInput,
  UpdateFollowUpStatusInput,
} from "./activity.schemas.js";

type ActivityUser = AuthenticatedRequest["user"];

export const activitiesTimelineObservability = {
  createPath: ["activity.create", "activity.audit.created", "lead.event.activity"],
  searchPath: ["activity.search", "lead.scope.activity"],
  stateChangePath: [
    "activity.complete",
    "activity.reassign",
    "activity.cancel",
    "activity.audit.state_change",
    "lead.event.follow_up",
  ],
  requiredFields: ["correlationId", "actorUserId", "leadId", "activityId", "outcome"],
} as const;

@Injectable()
export class ActivityService {
  constructor(
    private readonly leads: LeadRepository,
    private readonly activities: ActivityRepository,
    private readonly access: LeadAccessService,
    private readonly users: UsersRepository,
    private readonly audit: ActivityAuditService,
    private readonly events: ActivityEventService,
  ) {}

  async create(input: CreateActivityInput, user: ActivityUser, correlationId = "local") {
    if (!user) throw new ForbiddenException("Permission denied");
    const lead = await this.leads.findById(input.leadId);
    if (!lead) throw new NotFoundException("Lead not found");
    const decision = await this.access.decide({
      user,
      lead,
      action: "ACTIVITY_CREATE",
      correlationId,
    });
    if (!decision.allowed) {
      await this.auditDenied("ACTIVITY_ACCESS_DENIED", user, lead.id, correlationId, {
        reason: decision.reason,
      });
      throw new ForbiddenException("Permission denied");
    }

    const planned = Boolean(input.dueAt && !input.activityAt);
    if (planned && (lead.status === "ARCHIVED" || lead.archivedAt)) {
      throw new ConflictException("New follow-ups cannot be scheduled for archived leads");
    }

    const ownerMembership = await this.assertEligibleOwner(input.ownerUserId, user);
    const activity = await this.activities.create({
      data: input,
      status: planned ? "PLANNED" : "COMPLETED",
      recordedByUserId: user.id,
      teamId: ownerMembership?.team.id ?? lead.teamId,
      correlationId,
    });

    const eventType = planned ? "FOLLOW_UP_SCHEDULED" : "ACTIVITY_CREATED";
    const eventName = planned ? "FollowUpScheduled" : "ActivityCreated";
    await this.audit.record({
      eventType,
      activityId: activity.id,
      leadId: activity.leadId,
      actorUserId: user.id,
      correlationId,
      metadata: { type: activity.type, status: activity.status, ownerUserId: activity.ownerUserId },
    });
    await this.events.record({
      name: eventName,
      activityId: activity.id,
      leadId: activity.leadId,
      correlationId,
      payload: { leadId: activity.leadId, ownerUserId: activity.ownerUserId, type: activity.type },
    });

    return toActivityDetailDto(activity, correlationId);
  }

  async timeline(
    leadId: string,
    query: ActivityTimelineQueryInput,
    user: ActivityUser,
    correlationId = "local",
  ) {
    const lead = await this.leads.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");
    const decision = await this.access.decide({
      user,
      lead,
      action: "ACTIVITY_VIEW",
      correlationId,
    });
    if (!decision.allowed || !user) {
      await this.auditDenied("ACTIVITY_ACCESS_DENIED", user, leadId, correlationId, {
        reason: decision.reason,
      });
      throw new ForbiddenException("Permission denied");
    }

    const result = await this.activities.listForLead({
      leadId,
      page: query.page,
      pageSize: query.pageSize,
    });
    return {
      items: result.items.map((activity) => toActivityDetailDto(activity, correlationId)),
      total: result.total,
      page: query.page,
      pageSize: query.pageSize,
      correlationId,
    };
  }

  async search(query: ActivitySearchInput, user: ActivityUser, correlationId = "local") {
    const decision = await this.access.decide({
      user,
      action: "ACTIVITY_SEARCH",
      correlationId,
    });
    if (!decision.allowed || !user) throw new ForbiddenException("Permission denied");

    const result = await this.activities.search({
      query,
      scope: this.scopeForUser(user),
    });
    return {
      items: result.items.map((activity) => toActivitySummaryDto(activity, correlationId)),
      total: result.total,
      page: query.page,
      pageSize: query.pageSize,
      correlationId,
    };
  }

  async complete(
    activityId: string,
    input: CompleteActivityInput,
    user: ActivityUser,
    correlationId = "local",
  ) {
    const activity = await this.requireMutableActivity(
      activityId,
      user,
      "ACTIVITY_COMPLETE",
      correlationId,
    );
    if (activity.status !== "PLANNED") throw new ConflictException("Activity is not open");

    const updated = await this.activities.complete(activity, input, correlationId);
    if (!updated) throw this.stale(activity, user, correlationId);

    await this.audit.record({
      eventType: "FOLLOW_UP_COMPLETED",
      activityId,
      leadId: activity.leadId,
      actorUserId: user!.id,
      correlationId,
      metadata: { outcome: input.outcome, previousVersion: input.version },
    });
    await this.events.record({
      name: "FollowUpCompleted",
      activityId,
      leadId: activity.leadId,
      correlationId,
      payload: {
        leadId: activity.leadId,
        ownerUserId: updated.ownerUserId,
        outcome: input.outcome,
      },
    });
    return toActivityDetailDto(updated, correlationId);
  }

  async reassign(
    activityId: string,
    input: ReassignActivityInput,
    user: ActivityUser,
    correlationId = "local",
  ) {
    const activity = await this.requireMutableActivity(
      activityId,
      user,
      "ACTIVITY_REASSIGN",
      correlationId,
    );
    if (activity.status !== "PLANNED") throw new ConflictException("Activity is not open");
    if (!user) throw new ForbiddenException("Permission denied");

    const membership = await this.assertEligibleOwner(input.ownerUserId, user);
    const updated = await this.activities.reassign(
      activity,
      input,
      membership?.team.id ?? activity.teamId,
      correlationId,
    );
    if (!updated) throw this.stale(activity, user, correlationId);

    await this.audit.record({
      eventType: "FOLLOW_UP_REASSIGNED",
      activityId,
      leadId: activity.leadId,
      actorUserId: user!.id,
      correlationId,
      metadata: {
        fromUserId: activity.ownerUserId,
        toUserId: input.ownerUserId,
        reason: input.reason,
      },
    });
    await this.events.record({
      name: "FollowUpReassigned",
      activityId,
      leadId: activity.leadId,
      correlationId,
      payload: {
        leadId: activity.leadId,
        fromUserId: activity.ownerUserId,
        toUserId: input.ownerUserId,
      },
    });
    return toActivityDetailDto(updated, correlationId);
  }

  async cancel(
    activityId: string,
    input: CancelActivityInput,
    user: ActivityUser,
    correlationId = "local",
  ) {
    const activity = await this.requireMutableActivity(
      activityId,
      user,
      "ACTIVITY_CANCEL",
      correlationId,
    );
    if (activity.status !== "PLANNED") throw new ConflictException("Activity is not open");

    const updated = await this.activities.cancel(activity, input, correlationId);
    if (!updated) throw this.stale(activity, user, correlationId);

    await this.audit.record({
      eventType: "ACTIVITY_CANCELED",
      activityId,
      leadId: activity.leadId,
      actorUserId: user!.id,
      correlationId,
      metadata: { reason: input.reason, previousVersion: input.version },
    });
    await this.events.record({
      name: "ActivityCanceled",
      activityId,
      leadId: activity.leadId,
      correlationId,
      payload: { leadId: activity.leadId, ownerUserId: activity.ownerUserId },
    });
    return toActivityDetailDto(updated, correlationId);
  }

  async updateFollowUpStatus(
    activityId: string,
    input: UpdateFollowUpStatusInput,
    user: ActivityUser,
    correlationId = "local",
  ) {
    const action = input.status === "CANCELLED" ? "ACTIVITY_CANCEL" : "ACTIVITY_COMPLETE";
    const activity = await this.requireMutableActivity(activityId, user, action, correlationId);
    if (!activity.dueAt) throw new ConflictException("Activity is not a follow-up");
    if (!["PLANNED", "IN_PROGRESS"].includes(activity.status)) {
      throw new ConflictException("Follow-up is not open");
    }

    const updated = await this.activities.updateFollowUpStatus(
      activity,
      input,
      user!.id,
      correlationId,
    );
    if (!updated) throw this.stale(activity, user, correlationId);

    await this.audit.record({
      eventType:
        input.status === "COMPLETED"
          ? "FOLLOW_UP_COMPLETED"
          : input.status === "CANCELLED"
            ? "ACTIVITY_CANCELED"
            : "ACTIVITY_CORRECTED",
      activityId,
      leadId: activity.leadId,
      actorUserId: user!.id,
      correlationId,
      metadata: {
        fromStatus: activity.status,
        toStatus: input.status,
        outcome: input.outcome,
        previousVersion: input.version,
      },
    });
    await this.events.record({
      name:
        input.status === "COMPLETED"
          ? "FollowUpCompleted"
          : input.status === "CANCELLED"
            ? "ActivityCanceled"
            : "FollowUpStatusChanged",
      activityId,
      leadId: activity.leadId,
      correlationId,
      payload: {
        leadId: activity.leadId,
        ownerUserId: updated.ownerUserId,
        fromStatus: activity.status,
        toStatus: input.status,
      },
    });
    return toActivityDetailDto(updated, correlationId);
  }

  private async requireMutableActivity(
    activityId: string,
    user: ActivityUser,
    action: "ACTIVITY_COMPLETE" | "ACTIVITY_REASSIGN" | "ACTIVITY_CANCEL",
    correlationId: string,
  ): Promise<ActivityRecord> {
    const activity = await this.activities.findById(activityId);
    if (!activity) throw new NotFoundException("Activity not found");
    const decision = await this.access.decide({ user, lead: activity.lead, action, correlationId });
    if (!decision.allowed || !user) {
      await this.auditDenied("ACTIVITY_ACCESS_DENIED", user, activity.leadId, correlationId, {
        activityId,
        action,
        reason: decision.reason,
      });
      throw new ForbiddenException("Permission denied");
    }
    return activity;
  }

  private async assertEligibleOwner(ownerUserId: string, actor: NonNullable<ActivityUser>) {
    const owner = await this.users.findUser(ownerUserId);
    if (!owner || owner.status !== "ACTIVE") {
      throw new NotFoundException("Eligible activity owner not found");
    }
    const membership = await this.users.activeMembershipForUser(ownerUserId);
    if (actor.roles.includes("MANAGER") && membership?.team.id !== actor.activeTeam?.id) {
      throw new ForbiddenException("Permission denied");
    }
    if (actor.roles.includes("SALES_REPRESENTATIVE") && ownerUserId !== actor.id) {
      throw new ForbiddenException("Permission denied");
    }
    return membership;
  }

  private scopeForUser(user: NonNullable<ActivityUser>): Prisma.ActivityWhereInput {
    if (user.roles.includes("ADMIN")) return {};
    if (user.roles.includes("MANAGER") && user.activeTeam?.id) {
      return { lead: { teamId: user.activeTeam.id } };
    }
    return { lead: { ownerUserId: user.id } };
  }

  private async auditDenied(
    eventType: "ACTIVITY_ACCESS_DENIED",
    user: ActivityUser,
    leadId: string | undefined,
    correlationId: string,
    metadata: Record<string, unknown>,
  ) {
    await this.audit.record({
      eventType,
      outcome: "DENIED",
      actorUserId: user?.id,
      leadId,
      correlationId,
      metadata,
    });
  }

  private stale(activity: ActivityRecord, user: ActivityUser, correlationId: string) {
    void this.audit.record({
      eventType: "ACTIVITY_CORRECTED",
      outcome: "DENIED",
      activityId: activity.id,
      leadId: activity.leadId,
      actorUserId: user?.id,
      correlationId,
      metadata: { expectedVersion: activity.version },
    });
    return new PreconditionFailedException("This activity changed since you opened it.");
  }
}
