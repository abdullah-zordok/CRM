import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RequirePermission } from "../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../users/permissions/permission-codes.js";
import {
  assignLeadSchema,
  addLeadNoteSchema,
  changeLeadStatusSchema,
  leadHistoryQuerySchema,
  createLeadSchema,
  leadSearchSchema,
  updateLeadSchema,
  type AddLeadNoteInput,
  type AssignLeadInput,
  type ChangeLeadStatusInput,
  type CreateLeadInput,
  type LeadHistoryQueryInput,
  type LeadSearchInput,
  type UpdateLeadInput,
} from "./leads.schemas.js";
import { LeadService } from "./leads.service.js";
import { LeadAssignmentService } from "./assignment/lead-assignment.service.js";
import { LeadHistoryService } from "./notes/lead-history.service.js";
import { LeadNoteService } from "./notes/lead-note.service.js";
import { LeadStatusService } from "./status/lead-status.service.js";

@Controller("leads")
@UseGuards(SessionGuard, RoleGuard)
export class LeadsController {
  constructor(
    private readonly leads: LeadService,
    private readonly assignments: LeadAssignmentService,
    private readonly statuses: LeadStatusService,
    private readonly notes: LeadNoteService,
    private readonly history: LeadHistoryService,
  ) {}

  @Get("sources")
  @RequirePermission(PermissionCode.LeadsRead)
  sources() {
    return this.leads.listSources();
  }

  @Get()
  @RequirePermission(PermissionCode.LeadsSearch)
  search(
    @Query(new ZodValidationPipe(leadSearchSchema)) query: LeadSearchInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leads.search(query, request.user);
  }

  @Post()
  @RequirePermission(PermissionCode.LeadsCreate)
  create(
    @Body(new ZodValidationPipe(createLeadSchema)) body: CreateLeadInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leads.create(body, request.user);
  }

  @Put(":leadId/assignment")
  @RequirePermission(PermissionCode.LeadsAssign)
  assign(
    @Param("leadId") leadId: string,
    @Body(new ZodValidationPipe(assignLeadSchema)) body: AssignLeadInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.assignments.assign(leadId, body, request.user);
  }

  @Put(":leadId/status")
  @RequirePermission(PermissionCode.LeadsStatusChange)
  status(
    @Param("leadId") leadId: string,
    @Body(new ZodValidationPipe(changeLeadStatusSchema)) body: ChangeLeadStatusInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.statuses.changeStatus(leadId, body, request.user);
  }

  @Post(":leadId/notes")
  @RequirePermission(PermissionCode.LeadsNoteAdd)
  addNote(
    @Param("leadId") leadId: string,
    @Body(new ZodValidationPipe(addLeadNoteSchema)) body: AddLeadNoteInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.notes.addNote(leadId, body, request.user);
  }

  @Patch(":leadId")
  @RequirePermission(PermissionCode.LeadsUpdate)
  update(
    @Param("leadId") leadId: string,
    @Body(new ZodValidationPipe(updateLeadSchema)) body: UpdateLeadInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leads.update(leadId, body, request.user);
  }

  @Get(":leadId/history")
  @RequirePermission(PermissionCode.LeadsHistoryRead)
  leadHistory(
    @Param("leadId") leadId: string,
    @Query(new ZodValidationPipe(leadHistoryQuerySchema)) query: LeadHistoryQueryInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.history.list(leadId, query, request.user);
  }

  @Get(":leadId")
  @RequirePermission(PermissionCode.LeadsRead)
  detail(@Param("leadId") leadId: string, @Req() request: AuthenticatedRequest) {
    return this.leads.detail(leadId, request.user);
  }
}
