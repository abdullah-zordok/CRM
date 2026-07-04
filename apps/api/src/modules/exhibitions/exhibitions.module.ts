import { Module } from "@nestjs/common";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard } from "../../common/guards/session.guard.js";
import { AuthModule } from "../auth/auth.module.js";
import { LeadsModule } from "../leads/leads.module.js";
import { UsersModule } from "../users/users.module.js";
import { ExhibitionAccessService } from "./exhibition-access.service.js";
import { ExhibitionAuditService } from "./exhibition-audit.service.js";
import { ExhibitionEventService } from "./exhibition-event.service.js";
import { ExhibitionRepository } from "./exhibition.repository.js";
import { ExhibitionService } from "./exhibition.service.js";
import { ExhibitionsController } from "./exhibitions.controller.js";

export const exhibitionsObservability = {
  logFields: ["actorUserId", "exhibitionId", "leadId", "attendeeUserId", "correlationId"],
  counters: [
    "exhibitions.created",
    "exhibitions.updated",
    "exhibitions.status.changed",
    "exhibitions.archived",
    "exhibitions.restored",
    "exhibitions.attendees.assigned",
    "exhibitions.attendances.confirmed",
    "exhibitions.leads.attributed",
    "exhibitions.attributions.corrected",
    "exhibitions.access.denied",
    "exhibitions.stale_updates.rejected",
  ],
};

@Module({
  imports: [AuthModule, UsersModule, LeadsModule],
  controllers: [ExhibitionsController],
  providers: [
    ExhibitionService,
    ExhibitionRepository,
    ExhibitionAccessService,
    ExhibitionAuditService,
    ExhibitionEventService,
    SessionGuard,
    RoleGuard,
  ],
  exports: [ExhibitionService],
})
export class ExhibitionsModule {}
