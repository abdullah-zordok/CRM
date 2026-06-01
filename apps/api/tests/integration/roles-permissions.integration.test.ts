import { describe, expect, it } from "vitest";
import { RoleAssignmentService } from "../../src/modules/users/permissions/role-assignment.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";

describe("role permissions", () => {
  it("blocks removing final Admin role", async () => {
    const repo = new UsersRepository();
    const audit = new UsersSecurityAuditService(repo);
    const users = new UsersService(
      repo,
      new ActivationService(repo, audit, new PasswordService()),
      audit,
      new AdminEventService(),
    );
    const roles = new RoleAssignmentService(repo, users, audit);

    await expect(
      roles.replaceRoles("00000000-0000-4000-8000-000000000001", ["MANAGER"]),
    ).rejects.toThrow();
  });
});
