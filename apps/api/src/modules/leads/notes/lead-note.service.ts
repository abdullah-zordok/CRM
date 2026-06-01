import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { LeadAuditService } from "../audit/lead-audit.service.js";
import { LeadEventService } from "../events/lead-event.service.js";
import { LeadErrorCode, toLeadDetailDto } from "../leads.dto.js";
import { LeadRepository } from "../leads.repository.js";
import type { AddLeadNoteInput } from "../leads.schemas.js";
import { LeadAccessService } from "../permissions/lead-access.service.js";
import { LeadNoteRepository } from "./lead-note.repository.js";

type LeadUser = AuthenticatedRequest["user"];

@Injectable()
export class LeadNoteService {
  constructor(
    private readonly leads: LeadRepository,
    private readonly notes: LeadNoteRepository,
    private readonly access: LeadAccessService,
    private readonly audit: LeadAuditService,
    private readonly events: LeadEventService,
  ) {}

  async addNote(leadId: string, input: AddLeadNoteInput, user: LeadUser, correlationId = "local") {
    const lead = await this.leads.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");

    const decision = await this.access.decide({ user, lead, action: "ADD_NOTE", correlationId });
    if (!decision.allowed || !user) throw new ForbiddenException("Permission denied");

    const updated = await this.notes.addNote({
      leadId,
      version: input.version,
      authorUserId: user.id,
      body: input.body,
      correlationId,
    });
    if (!updated) {
      throw new PreconditionFailedException({
        code: LeadErrorCode.StaleUpdate,
        message: "Lead has changed. Reload and try again.",
      });
    }

    await this.audit.record({
      eventType: "LEAD_NOTE_ADDED",
      actorUserId: user.id,
      leadId,
      correlationId,
      metadata: { noteLength: input.body.length },
    });
    await this.events.record({
      name: "LeadNoteAdded",
      leadId,
      payload: { leadId, authorUserId: user.id },
      idempotencyKey: `lead-note:${leadId}:${updated.version}`,
      correlationId,
    });

    return toLeadDetailDto(updated, correlationId);
  }
}
