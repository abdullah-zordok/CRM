import { ConflictException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository.js";
import { UsersService } from "../users.service.js";
import { UsersSecurityAuditService } from "../audit/users-security-audit.service.js";
import type { BusinessRoleCode } from "./permission-codes.js";

@Injectable()
export class RoleAssignmentService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly users: UsersService,
    private readonly audit: UsersSecurityAuditService,
  ) {}

  async replaceRoles(userId: string, roles: BusinessRoleCode[], actorUserId = "system") {
    this.users.assertValidRoles(roles);
    const user = await this.users.requireUser(userId);
    if (
      user.roles.includes("ADMIN") &&
      !roles.includes("ADMIN") &&
      (await this.users.activeAdminCount(userId)) === 0
    ) {
      throw new ConflictException("At least one active Admin is required");
    }
    const removedRequiredAccess = user.roles.some((role) => !roles.includes(role));
    const updated = await this.repository.saveUser({ ...user, roles: [...new Set(roles)] });
    if (removedRequiredAccess) await this.users.revokeUserSessions(userId, "ROLE_REMOVED");
    await this.audit.record({
      eventType: removedRequiredAccess ? "ROLE_REMOVED" : "ROLE_ASSIGNED",
      actorUserId,
      targetUserId: userId,
      resource: "roles",
      metadata: { roles },
    });
    return updated;
  }
}
