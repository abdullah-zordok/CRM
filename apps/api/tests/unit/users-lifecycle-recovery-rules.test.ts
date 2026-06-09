import { describe, expect, it } from "vitest";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";

function service() {
  const repo = new UsersRepository();
  const audit = new UsersSecurityAuditService(repo);
  const passwords = new PasswordService();
  return {
    repo,
    users: new UsersService(
      repo,
      new ActivationService(repo, audit, passwords),
      audit,
      new AdminEventService(),
      passwords,
    ),
  };
}

describe("users lifecycle recovery rules", () => {
  it("blocks self deletion", async () => {
    const { users } = service();

    await expect(
      users.delete("00000000-0000-4000-8000-000000000001", "00000000-0000-4000-8000-000000000001"),
    ).rejects.toThrow(/cannot delete their own account/i);
  });

  it("soft deletes users and excludes them from active operations", async () => {
    const { repo, users } = service();
    const created = await users.create(
      {
        email: "rep-delete@example.com",
        displayName: "Rep Delete",
        password: "LongEnough123",
        roles: ["SALES_REPRESENTATIVE"],
        reviewerAccess: false,
        status: "ACTIVE",
      },
      "00000000-0000-4000-8000-000000000001",
    );

    await users.delete(created.id, "00000000-0000-4000-8000-000000000001");
    const stored = await repo.findUser(created.id);

    expect(stored).toMatchObject({ status: "DISABLED", isDeleted: true });
    await expect(users.detail(created.id)).resolves.toMatchObject({ isDeleted: true });
  });
});
