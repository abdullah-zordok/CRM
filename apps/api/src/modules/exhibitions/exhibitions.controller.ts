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
import { getCorrelationId } from "../../common/middleware/correlation.middleware.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../users/permissions/permission-codes.js";
import {
  ArchiveExhibitionSchema,
  AssignExhibitionAttendeeSchema,
  AttributeLeadSchema,
  ConfirmAttendanceSchema,
  CorrectAttributionSchema,
  CreateExhibitionSchema,
  ExhibitionSearchSchema,
  RestoreExhibitionSchema,
  UpdateExhibitionSchema,
  type ArchiveExhibitionInput,
  type AssignExhibitionAttendeeInput,
  type AttributeLeadInput,
  type ConfirmAttendanceInput,
  type CorrectAttributionInput,
  type CreateExhibitionInput,
  type ExhibitionSearchInput,
  type RestoreExhibitionInput,
  type UpdateExhibitionInput,
} from "./exhibition.schemas.js";
import { ExhibitionService } from "./exhibition.service.js";

@Controller("exhibitions")
@UseGuards(SessionGuard, RoleGuard)
export class ExhibitionsController {
  constructor(private readonly service: ExhibitionService) {}

  @Get()
  @RequirePermission(PermissionCode.ExhibitionsSearch)
  search(
    @Query(new ZodValidationPipe(ExhibitionSearchSchema)) query: ExhibitionSearchInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.search(query, request.user, getCorrelationId(request));
  }

  @Post()
  @RequirePermission(PermissionCode.ExhibitionsCreate)
  create(
    @Body(new ZodValidationPipe(CreateExhibitionSchema)) body: CreateExhibitionInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.create(body, request.user, getCorrelationId(request));
  }

  @Get(":id/summary")
  @RequirePermission(PermissionCode.ExhibitionsViewSummary)
  getSummary(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.service.getSummary(id, request.user, getCorrelationId(request));
  }

  @Get(":id")
  @RequirePermission(PermissionCode.ExhibitionsRead)
  findById(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.service.findById(id, request.user, getCorrelationId(request));
  }

  @Patch(":id")
  @RequirePermission(PermissionCode.ExhibitionsUpdate)
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateExhibitionSchema)) body: UpdateExhibitionInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.update(id, body, request.user, getCorrelationId(request));
  }

  @Put(":id/archive")
  @RequirePermission(PermissionCode.ExhibitionsArchive)
  archive(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ArchiveExhibitionSchema)) body: ArchiveExhibitionInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.archive(id, body, request.user, getCorrelationId(request));
  }

  @Put(":id/restore")
  @RequirePermission(PermissionCode.ExhibitionsRestore)
  restore(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(RestoreExhibitionSchema)) body: RestoreExhibitionInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.restore(id, body, request.user, getCorrelationId(request));
  }

  @Post(":id/attendees")
  @RequirePermission(PermissionCode.ExhibitionsAssignAttendee)
  assignAttendee(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(AssignExhibitionAttendeeSchema))
    body: AssignExhibitionAttendeeInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.assignAttendee(id, body, request.user, getCorrelationId(request));
  }

  @Put(":id/attendees/:attendeeId/confirm")
  @RequirePermission(PermissionCode.ExhibitionsConfirmAttendance)
  confirmAttendance(
    @Param("id") exhibitionId: string,
    @Param("attendeeId") attendeeId: string,
    @Body(new ZodValidationPipe(ConfirmAttendanceSchema)) body: ConfirmAttendanceInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.confirmAttendance(
      exhibitionId,
      attendeeId,
      body,
      request.user,
      getCorrelationId(request),
    );
  }

  @Post(":id/lead-attributions")
  @RequirePermission(PermissionCode.ExhibitionsAttributeLead)
  attributeLead(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(AttributeLeadSchema)) body: AttributeLeadInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.attributeLead(id, body, request.user, getCorrelationId(request));
  }

  @Patch(":id/lead-attributions/:attributionId")
  @RequirePermission(PermissionCode.ExhibitionsAttributeLead)
  correctAttribution(
    @Param("id") exhibitionId: string,
    @Param("attributionId") attributionId: string,
    @Body(new ZodValidationPipe(CorrectAttributionSchema)) body: CorrectAttributionInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.service.correctAttribution(
      exhibitionId,
      attributionId,
      body,
      request.user,
      getCorrelationId(request),
    );
  }
}
