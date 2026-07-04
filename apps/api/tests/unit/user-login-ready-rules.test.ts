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
  const events = new AdminEventService();
  const passwords = new PasswordService();
  return {
    repo,
    events,
    service: new UsersService(
      repo,
      new ActivationService(repo, audit, passwords),
      audit,
      events,
      passwords,
    ),
  };
}

describe("login-ready user creation rules", () => {
  it("hashes the initial password and never returns credential fields", async () => {
    const { repo, service } = makeUsersService();

    const created = await service.create({
      email: "rep@example.com",
      displayName: "Sales Rep",
      password: "LongEnough123",
      roles: ["SALES_REPRESENTATIVE"],
      status: "PENDING_ACTIVATION",
      reviewerAccess: false,
    });

    const stored = await repo.findUser(created.id);
    expect(stored?.passwordHash).toBeDefined();
    expect(stored?.passwordHash).not.toBe("LongEnough123");
    expect(JSON.stringify(created)).not.toContain("LongEnough123");
    expect(JSON.stringify(created)).not.toContain("passwordHash");
  });

  it("defaults Admin-created users to active and bypasses activation", async () => {
    const { events, service } = makeUsersService();

    const created = await service.create({
      email: "ready@example.com",
      displayName: "Ready Rep",
      password: "LongEnough123",
      roles: ["SALES_REPRESENTATIVE"],
      status: "PENDING_ACTIVATION",
      reviewerAccess: false,
    });

    expect(created.status).toBe("ACTIVE");
    expect(created.isDeleted).toBe(false);
    expect(events.list().map((event) => event.name)).toEqual(
      expect.arrayContaining(["UserCreated", "UserActivated"]),
    );
  });
});
