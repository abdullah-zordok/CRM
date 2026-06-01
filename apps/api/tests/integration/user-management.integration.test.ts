import { describe, expect, it } from "vitest";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";

function makeUsersService() {
  const repo = new UsersRepository();
  const audit = new UsersSecurityAuditService(repo);
  return {
    repo,
    service: new UsersService(
      repo,
      new ActivationService(repo, audit, new PasswordService()),
      audit,
      new AdminEventService(),
    ),
  };
}

describe("user management", () => {
  it("creates and disables a user", async () => {
    const { repo, service } = makeUsersService();
    const user = await service.create({
      email: "person@example.com",
      displayName: "Person",
      roles: ["MANAGER"],
      status: "PENDING_ACTIVATION",
      reviewerAccess: false,
    });

    await service.update(user.id, { status: "DISABLED" });

    expect((await repo.findUser(user.id))?.status).toBe("DISABLED");
    expect(repo.audits.some((audit) => audit.eventType === "USER_DISABLED")).toBe(true);
  });
});
