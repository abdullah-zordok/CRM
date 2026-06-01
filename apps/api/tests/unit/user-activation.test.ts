import { describe, expect, it } from "vitest";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("ActivationService", () => {
  it("hashes activation tokens and completes setup once", async () => {
    const repo = new UsersRepository();
    const audit = new UsersSecurityAuditService(repo);
    const service = new ActivationService(repo, audit, new PasswordService());
    const user = await repo.saveUser({
      id: repo.nextId(),
      email: "new@example.com",
      displayName: "New User",
      status: "PENDING_ACTIVATION",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const token = await service.issue(user.id);

    await service.complete({ activationToken: token.rawToken!, password: "LongEnough123" });

    const activated = await repo.findUser(user.id);
    expect(activated?.status).toBe("ACTIVE");
    expect(activated?.passwordHash).not.toBe("LongEnough123");
    expect(token.status).toBe("USED");
  });
});
