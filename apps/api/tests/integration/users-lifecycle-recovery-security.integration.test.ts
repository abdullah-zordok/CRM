import { describe, expect, it } from "vitest";
import { redactMetadata } from "../../src/modules/users/users.dto.js";

describe("users lifecycle recovery security", () => {
  it("redacts lifecycle metadata that could carry credentials or tokens", () => {
    expect(
      redactMetadata({
        reason: "USER_DELETED",
        password: "LongEnough123",
        sessionHash: "secret",
        activationToken: "token",
      }),
    ).toEqual({
      reason: "USER_DELETED",
      password: "[REDACTED]",
      sessionHash: "[REDACTED]",
      activationToken: "[REDACTED]",
    });
  });
});
