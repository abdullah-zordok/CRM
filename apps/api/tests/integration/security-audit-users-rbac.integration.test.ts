import { describe, expect, it } from "vitest";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("security audit for users RBAC", () => {
  it("records sanitized audit metadata", async () => {
    const repo = new UsersRepository();
    const audit = new UsersSecurityAuditService(repo);
    await audit.record({ eventType: "USER_CREATED", metadata: { activationToken: "raw" } });
    expect(repo.audits[0]?.metadata.activationToken).toBe("[REDACTED]");
  });
});
