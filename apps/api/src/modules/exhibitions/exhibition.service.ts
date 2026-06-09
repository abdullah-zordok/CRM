import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { LeadRepository } from "../leads/leads.repository.js";
import { LeadAccessService } from "../leads/permissions/lead-access.service.js";
import { UsersRepository } from "../users/users.repository.js";
import { mapExhibitionToDetailDto, mapExhibitionToSummaryDto } from "./exhibition.dto.js";
import { ExhibitionAccessService } from "./exhibition-access.service.js";
import { ExhibitionAuditService } from "./exhibition-audit.service.js";
import { ExhibitionEventService } from "./exhibition-event.service.js";
import { ExhibitionRepository, type ExhibitionRecord } from "./exhibition.repository.js";
import type {
  ArchiveExhibitionInput,
  AssignExhibitionAttendeeInput,
  AttributeLeadInput,
  ConfirmAttendanceInput,
  CorrectAttributionInput,
  CreateExhibitionInput,
  ExhibitionSearchInput,
  RestoreExhibitionInput,
  UpdateExhibitionInput,
} from "./exhibition.schemas.js";
import type { ExhibitionAction, ExhibitionDomainEventName } from "./exhibition.types.js";

type ExhibitionUser = AuthenticatedRequest["user"];
type RequiredUser = NonNullable<ExhibitionUser>;

@Injectable()
export class ExhibitionService {
  constructor(
    private readonly repository: ExhibitionRepository,
    private readonly access: ExhibitionAccessService,
    private readonly audit: ExhibitionAuditService,
    private readonly events: ExhibitionEventService,
    private readonly users: UsersRepository,
    private readonly leads: LeadRepository,
    private readonly leadAccess: LeadAccessService,
  ) {}

  async search(query: ExhibitionSearchInput, user: ExhibitionUser, correlationId = "local") {
    const actor = this.requireUser(user);
    await this.assertAccess({ user: actor, action: "SEARCH", correlationId });
    const result = await this.repository.search({ query, scope: this.scopeForUser(actor) });
    return {
      items: result.items.map(mapExhibitionToSummaryDto),
      total: result.total,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 25,
      correlationId,
    };
  }

  async create(input: CreateExhibitionInput, user: ExhibitionUser, correlationId = "local") {
    const actor = this.requireUser(user);
    await this.assertAccess({ user: actor, action: "CREATE", correlationId });
    const ownerTeam = await this.assertEligibleOwner(input.ownerUserId, actor);
    if (actor.roles.includes("MANAGER") && input.teamId && input.teamId !== actor.activeTeam?.id) {
      throw new ForbiddenException("Permission denied");
    }

    const exhibition = await this.repository.create({
      data: input,
      actorUserId: actor.id,
      ownerTeamId: ownerTeam?.team.id,
      correlationId,
    });
    await this.recordChange("CREATED", "ExhibitionCreated", exhibition, actor, correlationId);
    return this.toDetail(exhibition, correlationId);
  }

  async findById(id: string, user: ExhibitionUser, correlationId = "local") {
    const exhibition = await this.requireExhibition(id);
    await this.assertAccess({ user, exhibition, action: "VIEW", correlationId });
    return this.toDetail(exhibition, correlationId);
  }

  async update(
    id: string,
    input: UpdateExhibitionInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const exhibition = await this.requireExhibition(id);
    await this.assertAccess({ user: actor, exhibition, action: "UPDATE", correlationId });
    if (exhibition.status === "ARCHIVED") {
      throw new ConflictException("Archived exhibitions cannot be updated");
    }
    const ownerTeam = input.ownerUserId
      ? await this.assertEligibleOwner(input.ownerUserId, actor)
      : undefined;
    if (actor.roles.includes("MANAGER")) {
      const nextTeamId = input.teamId ?? ownerTeam?.team.id ?? exhibition.teamId;
      if (nextTeamId !== actor.activeTeam?.id) throw new ForbiddenException("Permission denied");
    }

    const updated = await this.repository.update(
      exhibition,
      input,
      actor.id,
      ownerTeam?.team.id,
      correlationId,
    );
    if (!updated) throw await this.stale(exhibition, actor, correlationId);
    await this.recordChange("UPDATED", "ExhibitionUpdated", updated, actor, correlationId);
    return this.toDetail(updated, correlationId);
  }

  async archive(
    id: string,
    input: ArchiveExhibitionInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const exhibition = await this.requireExhibition(id);
    await this.assertAccess({ user: actor, exhibition, action: "ARCHIVE", correlationId });
    if (exhibition.status === "ARCHIVED")
      throw new ConflictException("Exhibition is already archived");
    const updated = await this.repository.archive(id, input, actor.id, correlationId);
    if (!updated) throw await this.stale(exhibition, actor, correlationId);
    await this.recordChange("ARCHIVED", "ExhibitionStatusChanged", updated, actor, correlationId, {
      reason: input.reason,
    });
    return this.toDetail(updated, correlationId);
  }

  async restore(
    id: string,
    input: RestoreExhibitionInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const exhibition = await this.requireExhibition(id);
    await this.assertAccess({ user: actor, exhibition, action: "RESTORE", correlationId });
    if (exhibition.status !== "ARCHIVED")
      throw new ConflictException("Only archived exhibitions can be restored");
    if (input.restoredStatus === "ARCHIVED")
      throw new ConflictException("Choose a non-archived status");
    const updated = await this.repository.restore(id, input, actor.id, correlationId);
    if (!updated) throw await this.stale(exhibition, actor, correlationId);
    await this.recordChange("RESTORED", "ExhibitionStatusChanged", updated, actor, correlationId);
    return this.toDetail(updated, correlationId);
  }

  async getSummary(id: string, user: ExhibitionUser, correlationId = "local") {
    const exhibition = await this.requireExhibition(id);
    await this.assertAccess({ user, exhibition, action: "VIEW_SUMMARY", correlationId });
    return { ...(await this.repository.getSummary(id)), correlationId };
  }

  async assignAttendee(
    id: string,
    input: AssignExhibitionAttendeeInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const exhibition = await this.requireExhibition(id);
    await this.assertMutableExhibition(exhibition, actor, "ASSIGN_ATTENDEE", correlationId);
    const attendeeUser = await this.users.findUser(input.userId);
    if (!attendeeUser || attendeeUser.status !== "ACTIVE") {
      throw new NotFoundException("Eligible attendee not found");
    }
    const membership = await this.users.activeMembershipForUser(input.userId);
    if (actor.roles.includes("MANAGER") && membership?.team.id !== actor.activeTeam?.id) {
      throw new ForbiddenException("Permission denied");
    }

    try {
      const attendee = await this.repository.assignAttendee({
        exhibitionId: id,
        data: input,
        teamId: membership?.team.id ?? exhibition.teamId,
        actorUserId: actor.id,
        correlationId,
      });
      await this.audit.logHistory({
        exhibitionId: id,
        entryType: "ATTENDEE_ASSIGNED",
        actorUserId: actor.id,
        attendeeUserId: input.userId,
        summary: "Exhibition attendee assigned",
        correlationId,
      });
      await this.emit("ExhibitionAttendeeAssigned", id, correlationId, {
        attendeeUserId: input.userId,
      });
      return attendee;
    } catch (error) {
      if (this.isUniqueError(error)) throw new ConflictException("Attendee is already assigned");
      throw error;
    }
  }

  async confirmAttendance(
    exhibitionId: string,
    attendeeId: string,
    input: ConfirmAttendanceInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const attendee = await this.repository.findAttendee(attendeeId);
    if (!attendee || attendee.exhibitionId !== exhibitionId) {
      throw new NotFoundException("Attendee not found");
    }
    await this.assertMutableExhibition(
      attendee.exhibition as ExhibitionRecord,
      actor,
      "CONFIRM_ATTENDANCE",
      correlationId,
    );
    const attendeeUserIds = [attendee.userId];
    await this.assertAccess({
      user: actor,
      exhibition: attendee.exhibition,
      attendeeUserIds,
      action: "CONFIRM_ATTENDANCE",
      correlationId,
    });
    if (attendee.status === "CONFIRMED" && input.status === "CONFIRMED") {
      throw new ConflictException("Attendance is already confirmed");
    }
    const updated = await this.repository.confirmAttendance({
      attendeeId,
      data: input,
      actorUserId: actor.id,
      correlationId,
    });
    if (!updated)
      throw await this.stale(attendee.exhibition as ExhibitionRecord, actor, correlationId);
    await this.audit.logHistory({
      exhibitionId,
      entryType: input.status === "CORRECTED" ? "ATTENDANCE_CORRECTED" : "ATTENDANCE_CONFIRMED",
      actorUserId: actor.id,
      attendeeUserId: attendee.userId,
      summary: "Exhibition attendance updated",
      metadata: { status: input.status, correctionReason: input.correctionReason },
      correlationId,
    });
    await this.emit("ExhibitionAttendanceConfirmed", exhibitionId, correlationId, {
      attendeeUserId: attendee.userId,
      status: input.status,
    });
    return updated;
  }

  async attributeLead(
    id: string,
    input: AttributeLeadInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const exhibition = await this.requireExhibition(id);
    await this.assertMutableExhibition(exhibition, actor, "ATTRIBUTE_LEAD", correlationId);
    const lead = await this.leads.findById(input.leadId);
    if (!lead) throw new NotFoundException("Lead not found");
    const leadDecision = await this.leadAccess.decide({
      user: actor,
      lead,
      action: "VIEW",
      correlationId,
    });
    if (!leadDecision.allowed) throw new ForbiddenException("Permission denied");
    const existing = await this.repository.findActiveAttribution(id, input.leadId);
    if (existing) throw new ConflictException("Lead is already attributed to this exhibition");

    const attribution = await this.repository.attributeLead({
      exhibitionId: id,
      data: input,
      actorUserId: actor.id,
      sourceReference: lead.exhibitionReference,
      correlationId,
    });
    await this.audit.logHistory({
      exhibitionId: id,
      entryType: "LEAD_ATTRIBUTED",
      actorUserId: actor.id,
      leadId: input.leadId,
      summary: "Lead attributed to exhibition",
      correlationId,
    });
    await this.emit("ExhibitionLeadAttributed", id, correlationId, { leadId: input.leadId });
    return attribution;
  }

  async correctAttribution(
    exhibitionId: string,
    attributionId: string,
    input: CorrectAttributionInput,
    user: ExhibitionUser,
    correlationId = "local",
  ) {
    const actor = this.requireUser(user);
    const attribution = await this.repository.findAttribution(attributionId);
    if (!attribution || attribution.exhibitionId !== exhibitionId) {
      throw new NotFoundException("Attribution not found");
    }
    await this.assertMutableExhibition(
      attribution.exhibition as ExhibitionRecord,
      actor,
      "ATTRIBUTE_LEAD",
      correlationId,
    );
    const updated = await this.repository.correctAttribution({
      attributionId,
      data: input,
      actorUserId: actor.id,
      correlationId,
    });
    if (!updated)
      throw await this.stale(attribution.exhibition as ExhibitionRecord, actor, correlationId);
    await this.audit.logHistory({
      exhibitionId,
      entryType: input.status === "REMOVED" ? "ATTRIBUTION_REMOVED" : "ATTRIBUTION_CORRECTED",
      actorUserId: actor.id,
      leadId: attribution.leadId,
      summary: "Exhibition attribution corrected",
      metadata: { status: input.status, correctionReason: input.correctionReason },
      correlationId,
    });
    await this.emit("ExhibitionAttributionCorrected", exhibitionId, correlationId, {
      leadId: attribution.leadId,
      status: input.status,
    });
    return updated;
  }

  private requireUser(user: ExhibitionUser): RequiredUser {
    if (!user) throw new ForbiddenException("Permission denied");
    return user;
  }

  private async requireExhibition(id: string): Promise<ExhibitionRecord> {
    const exhibition = await this.repository.findById(id);
    if (!exhibition) throw new NotFoundException("Exhibition not found");
    return exhibition;
  }

  private async assertMutableExhibition(
    exhibition: ExhibitionRecord,
    user: RequiredUser,
    action: ExhibitionAction,
    correlationId: string,
  ) {
    await this.assertAccess({ user, exhibition, action, correlationId });
    if (exhibition.status === "ARCHIVED") {
      throw new ConflictException("Archived exhibitions cannot be changed");
    }
  }

  private async assertAccess(input: {
    user?: ExhibitionUser;
    exhibition?: { id: string; ownerUserId: string; teamId: string | null };
    lead?: { id: string; ownerUserId: string; teamId: string | null };
    attendeeUserIds?: string[];
    action: ExhibitionAction;
    correlationId: string;
  }) {
    const decision = await this.access.decide(input);
    if (!decision.allowed) {
      await this.audit.logSecurity({
        eventType: "EXHIBITION_ACCESS_DENIED",
        outcome: "DENIED",
        actorUserId: input.user?.id,
        resource: input.exhibition?.id ? `exhibition:${input.exhibition.id}` : "exhibitions",
        correlationId: input.correlationId,
        metadata: { action: input.action, reason: decision.reason },
      });
      throw new ForbiddenException("Permission denied");
    }
  }

  private async assertEligibleOwner(ownerUserId: string, actor: RequiredUser) {
    const owner = await this.users.findUser(ownerUserId);
    if (!owner || owner.status !== "ACTIVE")
      throw new NotFoundException("Eligible owner not found");
    const membership = await this.users.activeMembershipForUser(ownerUserId);
    if (actor.roles.includes("MANAGER") && membership?.team.id !== actor.activeTeam?.id) {
      throw new ForbiddenException("Permission denied");
    }
    return membership;
  }

  private scopeForUser(user: RequiredUser): Prisma.ExhibitionWhereInput {
    if (user.roles.includes("ADMIN")) return {};
    if (user.roles.includes("MANAGER") && user.activeTeam?.id) {
      return { teamId: user.activeTeam.id };
    }
    return {
      OR: [
        { attendees: { some: { userId: user.id } } },
        { attributions: { some: { lead: { ownerUserId: user.id } } } },
      ],
    };
  }

  private async toDetail(exhibition: ExhibitionRecord, correlationId: string) {
    const summary = await this.repository.getSummary(exhibition.id);
    return mapExhibitionToDetailDto(exhibition, exhibition.attendees, exhibition.attributions, {
      ...summary,
      correlationId,
    });
  }

  private async recordChange(
    entryType: "CREATED" | "UPDATED" | "ARCHIVED" | "RESTORED",
    eventName: ExhibitionDomainEventName,
    exhibition: ExhibitionRecord,
    actor: RequiredUser,
    correlationId: string,
    metadata: Record<string, unknown> = {},
  ) {
    await this.audit.logHistory({
      exhibitionId: exhibition.id,
      entryType,
      actorUserId: actor.id,
      summary: `Exhibition ${entryType.toLowerCase()}`,
      metadata,
      correlationId,
    });
    await this.emit(eventName, exhibition.id, correlationId, {
      exhibitionId: exhibition.id,
      status: exhibition.status,
    });
  }

  private emit(
    name: ExhibitionDomainEventName,
    exhibitionId: string,
    correlationId: string,
    payload: Record<string, unknown>,
  ) {
    return this.events.emit({
      name,
      exhibitionId,
      payload,
      idempotencyKey: `${name}:${exhibitionId}:${correlationId}`,
      correlationId,
    });
  }

  private async stale(exhibition: ExhibitionRecord, user: RequiredUser, correlationId: string) {
    await this.audit.logHistory({
      exhibitionId: exhibition.id,
      entryType: "STALE_UPDATE_REJECTED",
      actorUserId: user.id,
      summary: "Stale exhibition update rejected",
      metadata: { expectedVersion: exhibition.version },
      correlationId,
    });
    return new PreconditionFailedException("This exhibition changed since you opened it.");
  }

  private isUniqueError(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
  }
}
