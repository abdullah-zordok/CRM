import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository.js";
import { UsersService } from "../users.service.js";
import { UsersSecurityAuditService } from "../audit/users-security-audit.service.js";

@Injectable()
export class ReviewerAccessService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly users: UsersService,
    private readonly audit: UsersSecurityAuditService,
  ) {}

  async setReviewerAccess(userId: string, enabled: boolean, actorUserId = "system") {
    const user = await this.users.requireUser(userId);
    const updated = await this.repository.saveUser({ ...user, hasReviewerAccess: enabled });
    if (!enabled) await this.users.revokeUserSessions(userId, "REVIEWER_ACCESS_REMOVED");
    await this.audit.record({
      eventType: enabled ? "REVIEWER_ASSIGNED" : "REVIEWER_REMOVED",
      actorUserId,
      targetUserId: userId,
      resource: "reviewer-access",
      metadata: { enabled },
    });
    return updated;
  }
}
