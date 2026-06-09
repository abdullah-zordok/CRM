import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../../users/permissions/permission-codes.js";
import {
  activitySearchSchema,
  activityTimelineQuerySchema,
  cancelActivitySchema,
  completeActivitySchema,
  createActivitySchema,
  reassignActivitySchema,
  updateFollowUpStatusSchema,
  type ActivitySearchInput,
  type ActivityTimelineQueryInput,
  type CancelActivityInput,
  type CompleteActivityInput,
  type CreateActivityInput,
  type ReassignActivityInput,
  type UpdateFollowUpStatusInput,
} from "./activity.schemas.js";
import { ActivityService } from "./activity.service.js";

@Controller()
@UseGuards(SessionGuard, RoleGuard)
export class ActivitiesController {
  constructor(private readonly activities: ActivityService) {}

  @Get("activities")
  @RequirePermission(PermissionCode.ActivitiesSearch)
  search(
    @Query(new ZodValidationPipe(activitySearchSchema)) query: ActivitySearchInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.search(query, request.user);
  }

  @Post("activities")
  @RequirePermission(PermissionCode.ActivitiesCreate)
  create(
    @Body(new ZodValidationPipe(createActivitySchema)) body: CreateActivityInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.create(body, request.user);
  }

  @Get("leads/:leadId/activities")
  @RequirePermission(PermissionCode.ActivitiesRead)
  timeline(
    @Param("leadId") leadId: string,
    @Query(new ZodValidationPipe(activityTimelineQuerySchema)) query: ActivityTimelineQueryInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.timeline(leadId, query, request.user);
  }

  @Put("activities/:activityId/complete")
  @RequirePermission(PermissionCode.ActivitiesManage)
  complete(
    @Param("activityId") activityId: string,
    @Body(new ZodValidationPipe(completeActivitySchema)) body: CompleteActivityInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.complete(activityId, body, request.user);
  }

  @Put("activities/:activityId/reassign")
  @RequirePermission(PermissionCode.ActivitiesManage)
  reassign(
    @Param("activityId") activityId: string,
    @Body(new ZodValidationPipe(reassignActivitySchema)) body: ReassignActivityInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.reassign(activityId, body, request.user);
  }

  @Put("activities/:activityId/cancel")
  @RequirePermission(PermissionCode.ActivitiesManage)
  cancel(
    @Param("activityId") activityId: string,
    @Body(new ZodValidationPipe(cancelActivitySchema)) body: CancelActivityInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.cancel(activityId, body, request.user);
  }

  @Put("activities/:activityId/follow-up-status")
  @RequirePermission(PermissionCode.ActivitiesManage)
  followUpStatus(
    @Param("activityId") activityId: string,
    @Body(new ZodValidationPipe(updateFollowUpStatusSchema)) body: UpdateFollowUpStatusInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.activities.updateFollowUpStatus(activityId, body, request.user);
  }
}
