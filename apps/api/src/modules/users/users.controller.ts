import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { RequirePermission } from "../../common/decorators/roles.decorator.js";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard, type AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { PermissionCode } from "./permissions/permission-codes.js";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "./users.schemas.js";
import { UsersService } from "./users.service.js";

@Controller("users")
@UseGuards(SessionGuard, RoleGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermission(PermissionCode.UsersRead)
  list(
    @Query()
    query: {
      search?: string;
      role?: string;
      status?: string;
      teamId?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.users.list(query);
  }

  @Post()
  @RequirePermission(PermissionCode.UsersManage)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() body: CreateUserInput, @Req() request: AuthenticatedRequest) {
    return this.users.create(body, request.user?.id);
  }

  @Get(":userId")
  @RequirePermission(PermissionCode.UsersRead)
  detail(@Param("userId") userId: string) {
    return this.users.detail(userId);
  }

  @Patch(":userId")
  @RequirePermission(PermissionCode.UsersManage)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  update(
    @Param("userId") userId: string,
    @Body() body: UpdateUserInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.users.update(userId, body, request.user?.id);
  }
}
