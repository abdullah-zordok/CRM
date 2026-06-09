import { describe, expect, it } from "vitest";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";

describe("users lifecycle recovery integration", () => {
  it("blocks last-active-admin removal", async () => {
    const repo = new UsersRepository();
    const audit = new UsersSecurityAuditService(repo);
    const passwords = new PasswordService();
    const users = new UsersService(
      repo,
      new ActivationService(repo, audit, passwords),
      audit,
      new AdminEventService(),
      passwords,
    );

    await expect(
      users.update("00000000-0000-4000-8000-000000000001", { status: "DISABLED" }, "other-admin"),
    ).rejects.toThrow(/At least one active Admin/i);
  });
});
