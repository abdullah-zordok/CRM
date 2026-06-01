import { describe, expect, it } from "vitest";
import { PasswordService } from "../../src/modules/auth/security/password.service.js";
import { SessionTokenService } from "../../src/modules/auth/security/session-token.service.js";

describe("auth security", () => {
  it("hashes session tokens", () => {
    const service = new SessionTokenService();
    const token = service.createToken();

    expect(service.hash(token)).not.toBe(token);
    expect(service.hash(token)).toHaveLength(64);
  });

  it("hashes passwords with argon2 and verifies them", async () => {
    const service = new PasswordService();
    const hash = await service.hash("ChangeThisPassword123!");

    expect(hash).not.toBe("ChangeThisPassword123!");
    expect(await service.verify(hash, "ChangeThisPassword123!")).toBe(true);
    expect(await service.verify(hash, "wrong-password")).toBe(false);
  });
});
