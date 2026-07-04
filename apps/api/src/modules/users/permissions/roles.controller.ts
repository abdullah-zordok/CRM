import { Body, Controller, Inject, Param, Put, Req, UseGuards } from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../../common/validation/zod-validation.pipe.js";
import { toUserDetail } from "../users.dto.js";
import {
  replaceRolesSchema,
  reviewerAccessSchema,
  type ReplaceRolesInput,
  type ReviewerAccessInput,
} from "../users.schemas.js";
import { PermissionCode } from "./permission-codes.js";
import { ReviewerAccessService } from "./reviewer-access.service.js";
import { RoleAssignmentService } from "./role-assignment.service.js";

@Controller("users/:userId")
@UseGuards(SessionGuard, RoleGuard)
export class RolesController {
  constructor(
    @Inject(RoleAssignmentService)
    private readonly roleAssignments: RoleAssignmentService,
    @Inject(ReviewerAccessService)
    private readonly reviewerAccess: ReviewerAccessService,
  ) {}

  @Put("roles")
  @RequirePermission(PermissionCode.RolesAssign)
  async replaceRoles(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(replaceRolesSchema)) body: ReplaceRolesInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return toUserDetail(await this.roleAssignments.replaceRoles(userId, body.roles, request.user?.id));
  }

  @Put("reviewer-access")
  @RequirePermission(PermissionCode.RolesAssign)
  async setReviewerAccess(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(reviewerAccessSchema)) body: ReviewerAccessInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return toUserDetail(
      await this.reviewerAccess.setReviewerAccess(userId, body.enabled, request.user?.id),
    );
  }
}
