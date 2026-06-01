import { describe, expect, it } from "vitest";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";

describe("disabled user RBAC", () => {
  it("revokes active sessions when disabled", async () => {
    const repo = new UsersRepository();
    const audit = new UsersSecurityAuditService(repo);
    const service = new UsersService(
      repo,
      new ActivationService(repo, audit, new PasswordService()),
      audit,
      new AdminEventService(),
    );
    const user = await repo.saveUser({
      id: repo.nextId(),
      email: "disabled@example.com",
      displayName: "Disabled",
      status: "ACTIVE",
      roles: ["MANAGER"],
      hasReviewerAccess: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await repo.saveSession({
      id: repo.nextId(),
      userId: user.id,
      sessionHash: "hash",
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 100000),
    });

    await service.update(user.id, { status: "DISABLED" });

    expect(await repo.activeSessionsForUser(user.id)).toHaveLength(0);
  });
});
