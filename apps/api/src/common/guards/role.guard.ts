import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/roles.decorator.js";
import { PermissionService } from "../../modules/users/permissions/permission.service.js";
import type { PermissionCode } from "../../modules/users/permissions/permission-codes.js";
import type { AuthenticatedRequest } from "./session.guard.js";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<PermissionCode>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!(await this.permissionService.can(user, requiredPermission, "local"))) {
      throw new ForbiddenException("Permission denied");
    }

    return true;
  }
}
