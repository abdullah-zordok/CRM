import { UnauthorizedException } from "@nestjs/common";
import { AuthSessionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AuthRepository } from "../../src/modules/auth/auth.repository.js";
import { AuthService } from "../../src/modules/auth/auth.service.js";
import { SecurityAuditService } from "../../src/modules/auth/audit/security-audit.service.js";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";
import { SessionTokenService } from "../../src/modules/auth/security/session-token.service.js";

function makeAuthService(user: {
  id: string;
  email: string;
  passwordHash?: string;
  status: "ACTIVE" | "DISABLED";
  isDeleted?: boolean;
}) {
  const sessions: Record<string, unknown> = {};
  const audit = { record: async () => undefined } as unknown as SecurityAuditService;
  const repository = {
    findUserByEmail: async (email: string) =>
      email.toLowerCase() === user.email
        ? {
            ...user,
            roleAssignments: [{ roleCode: "SALES_REPRESENTATIVE", status: "ACTIVE" }],
            reviewerAssignments: [],
            teamMemberships: [],
          }
        : null,
    createSession: async (userId: string, sessionHash: string, expiresAt: Date) => {
      const session = {
        id: "00000000-0000-4000-8000-000000000099",
        userId,
        sessionHash,
        status: AuthSessionStatus.ACTIVE,
        expiresAt,
      };
      sessions[sessionHash] = session;
      return session;
    },
    findActiveSession: async (sessionHash: string) => sessions[sessionHash] ?? null,
    revokeSession: async () => undefined,
    isActive: (status: string, record?: { isDeleted?: boolean }) =>
      status === "ACTIVE" && !record?.isDeleted,
  } as unknown as AuthRepository;
  return new AuthService(repository, new PasswordService(), new SessionTokenService(), audit);
}

describe("login-ready user integration", () => {
  it("allows an Admin-created active user to sign in immediately", async () => {
    const password = "LongEnough123";
    const service = makeAuthService({
      id: "00000000-0000-4000-8000-000000000003",
      email: "rep@example.com",
      passwordHash: await new PasswordService().hash(password),
      status: "ACTIVE",
      isDeleted: false,
    });

    const login = await service.login("rep@example.com", password);

    expect(login.token).toBeTruthy();
    expect(login.sessionId).toBe("00000000-0000-4000-8000-000000000099");
  });

  it("denies disabled and deleted users with an unauthorized response", async () => {
    const passwordHash = await new PasswordService().hash("LongEnough123");
    const disabled = makeAuthService({
      id: "00000000-0000-4000-8000-000000000004",
      email: "disabled@example.com",
      passwordHash,
      status: "DISABLED",
    });
    const deleted = makeAuthService({
      id: "00000000-0000-4000-8000-000000000005",
      email: "deleted@example.com",
      passwordHash,
      status: "ACTIVE",
      isDeleted: true,
    });

    await expect(disabled.login("disabled@example.com", "LongEnough123")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(deleted.login("deleted@example.com", "LongEnough123")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
