import { Injectable } from "@nestjs/common";
import { PERMISSION_MATRIX, type PermissionCode } from "./permission-codes.js";
import { UsersRepository } from "../users.repository.js";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";

type PermissionUser = NonNullable<AuthenticatedRequest["user"]>;

@Injectable()
export class PermissionService {
  constructor(private readonly repository: UsersRepository) {}

  matrix() {
    return {
      roles: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
      reviewerAccess: "OPERATIONS_REVIEWER",
      permissions: PERMISSION_MATRIX,
    };
  }

  async can(
    user: PermissionUser | undefined,
    permissionCode: PermissionCode,
    correlationId = "local",
  ): Promise<boolean> {
    const definition = PERMISSION_MATRIX.find((permission) => permission.code === permissionCode);
    const allowed =
      Boolean(user) &&
      user?.status === "ACTIVE" &&
      Boolean(
        definition?.grantedTo.some(
          (grantee) =>
            user.roles.includes(grantee as never) ||
            (grantee === "OPERATIONS_REVIEWER" && user.hasReviewerAccess),
        ),
      );

    await this.repository.saveAccessDecision({
      userId: user?.id,
      permissionCode,
      resource: definition?.resource ?? "unknown",
      action: definition?.action ?? "unknown",
      decision: allowed ? "ALLOW" : "DENY",
      reason: allowed ? "PERMISSION_GRANTED" : "DEFAULT_DENY",
      correlationId,
      decidedAt: new Date(),
    });

    return allowed;
  }
}
