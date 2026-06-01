import { describe, expect, it } from "vitest";
import { SessionTokenService } from "../../src/modules/auth/security/session-token.service.js";

describe("auth security", () => {
  it("hashes session tokens", () => {
    const service = new SessionTokenService();
    const token = service.createToken();
    expect(service.hash(token)).not.toBe(token);
  });
});
