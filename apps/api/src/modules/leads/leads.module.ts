import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { UsersModule } from "../users/users.module.js";
import { LeadAssignmentRepository } from "./assignment/lead-assignment.repository.js";
import { LeadAssignmentService } from "./assignment/lead-assignment.service.js";
import { LeadAuditService } from "./audit/lead-audit.service.js";
import { LeadEventService } from "./events/lead-event.service.js";
import { LeadDuplicateService } from "./leads-duplicate.service.js";
import { LeadsController } from "./leads.controller.js";
import { LeadRepository } from "./leads.repository.js";
import { LeadService } from "./leads.service.js";
import { LeadHistoryRepository } from "./notes/lead-history.repository.js";
import { LeadHistoryService } from "./notes/lead-history.service.js";
import { LeadNoteRepository } from "./notes/lead-note.repository.js";
import { LeadNoteService } from "./notes/lead-note.service.js";
import { LeadAccessService } from "./permissions/lead-access.service.js";
import { LeadExhibitionReferenceRepository } from "./sources/lead-exhibition-reference.repository.js";
import { LeadSourceService } from "./sources/lead-source.service.js";
import { LeadStatusRepository } from "./status/lead-status.repository.js";
import { LeadStatusService } from "./status/lead-status.service.js";

export const leadsCoreObservability = {
  logFields: ["actorUserId", "leadId", "ownerUserId", "teamId", "correlationId"],
  counters: [
    "leads.created",
    "leads.assigned",
    "leads.status.changed",
    "leads.notes.added",
    "leads.duplicates.blocked",
    "leads.access.denied",
    "leads.stale_updates.rejected",
  ],
};

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [LeadsController],
  providers: [
    LeadRepository,
    LeadService,
    LeadAssignmentRepository,
    LeadAssignmentService,
    LeadStatusRepository,
    LeadStatusService,
    LeadNoteRepository,
    LeadNoteService,
    LeadHistoryRepository,
    LeadHistoryService,
    LeadExhibitionReferenceRepository,
    LeadSourceService,
    LeadDuplicateService,
    LeadAccessService,
    LeadAuditService,
    LeadEventService,
  ],
  exports: [
    LeadRepository,
    LeadService,
    LeadAssignmentService,
    LeadStatusService,
    LeadNoteService,
    LeadHistoryService,
    LeadAccessService,
    LeadAuditService,
    LeadEventService,
  ],
})
export class LeadsModule {}
