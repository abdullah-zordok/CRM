import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { RequirePermission } from "../../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "../permissions/permission-codes.js";
import { toTeamDto } from "../users.dto.js";
import {
  createTeamSchema,
  replaceTeamMembersSchema,
  updateTeamSchema,
  type CreateTeamInput,
  type ReplaceTeamMembersInput,
  type UpdateTeamInput,
} from "../users.schemas.js";
import { TeamService } from "./team.service.js";

@Controller("teams")
@UseGuards(SessionGuard, RoleGuard)
export class TeamsController {
  constructor(private readonly teams: TeamService) {}

  @Get()
  @RequirePermission(PermissionCode.TeamsRead)
  async list() {
    return {
      items: (await this.teams.list()).map((team) => toTeamDto(team)),
      correlationId: "local",
    };
  }

  @Post()
  @RequirePermission(PermissionCode.TeamsManage)
  @UsePipes(new ZodValidationPipe(createTeamSchema))
  async create(@Body() body: CreateTeamInput, @Req() request: AuthenticatedRequest) {
    return toTeamDto(await this.teams.create(body, request.user?.id));
  }

  @Patch(":teamId")
  @RequirePermission(PermissionCode.TeamsManage)
  @UsePipes(new ZodValidationPipe(updateTeamSchema))
  async update(
    @Param("teamId") teamId: string,
    @Body() body: UpdateTeamInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return toTeamDto(await this.teams.update(teamId, body, request.user?.id));
  }

  @Put(":teamId/members")
  @RequirePermission(PermissionCode.TeamsManage)
  @UsePipes(new ZodValidationPipe(replaceTeamMembersSchema))
  async replaceMembers(
    @Param("teamId") teamId: string,
    @Body() body: ReplaceTeamMembersInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return toTeamDto(await this.teams.replaceMembers(teamId, body, request.user?.id));
  }
}
