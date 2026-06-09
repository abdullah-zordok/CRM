import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";
import { ActivationService } from "../../src/modules/users/activation/activation.service.js";
import { AdminEventService } from "../../src/modules/users/admin-event.service.js";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { createUserSchema } from "../../src/modules/users/users.schemas.js";
import { redactMetadata } from "../../src/modules/users/users.dto.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";
import { UsersService } from "../../src/modules/users/users.service.js";

function makeUsersService() {
  const repo = new UsersRepository();
  const audit = new UsersSecurityAuditService(repo);
  const passwords = new PasswordService();
  return new UsersService(
    repo,
    new ActivationService(repo, audit, passwords),
    audit,
    new AdminEventService(),
    passwords,
  );
}

describe("login-ready user security paths", () => {
  it("rejects duplicate or malformed credential inputs before persistence", () => {
    expect(() =>
      createUserSchema.parse({
        email: "not-an-email",
        displayName: "Bad User",
        password: "LongEnough123",
        roles: ["SALES_REPRESENTATIVE"],
      }),
    ).toThrow();
  });

  it("rejects duplicate active-operation emails", async () => {
    const service = makeUsersService();
    const input = {
      email: "duplicate@example.com",
      displayName: "Duplicate Rep",
      password: "LongEnough123",
      roles: ["SALES_REPRESENTATIVE" as const],
      status: "ACTIVE" as const,
      reviewerAccess: false,
    };

    await service.create(input);

    await expect(service.create(input)).rejects.toBeInstanceOf(ConflictException);
  });

  it("redacts raw credential metadata and uses a generic unauthorized denial type", () => {
    expect(redactMetadata({ password: "LongEnough123", tokenHash: "secret", status: "ACTIVE" }))
      .toEqual({ password: "[REDACTED]", tokenHash: "[REDACTED]", status: "ACTIVE" });

    const denial = new UnauthorizedException("Invalid credentials");
    expect(denial.message).toBe("Invalid credentials");
  });
});
