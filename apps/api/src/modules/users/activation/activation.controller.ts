import { Body, Controller, Param, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../permissions/permission-codes.js";
import { completeActivationSchema, type CompleteActivationInput } from "../users.schemas.js";
import { ActivationService } from "./activation.service.js";

@Controller()
export class ActivationController {
  constructor(private readonly activation: ActivationService) {}

  @Post("users/:userId/activation")
  @UseGuards(SessionGuard, RoleGuard)
  @RequirePermission(PermissionCode.UsersManage)
  async issue(@Param("userId") userId: string, @Req() request: AuthenticatedRequest) {
    const record = await this.activation.issue(userId, request.user?.id);
    return { userId, expiresAt: record.expiresAt.toISOString(), correlationId: "local" };
  }

  @Post("activation/complete")
  @UsePipes(new ZodValidationPipe(completeActivationSchema))
  async complete(@Body() body: CompleteActivationInput) {
    await this.activation.complete(body);
  }
}
