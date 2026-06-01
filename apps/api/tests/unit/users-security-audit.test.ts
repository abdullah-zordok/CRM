import { describe, expect, it } from "vitest";
import { redactMetadata } from "../../src/modules/users/users.dto.js";

describe("audit redaction", () => {
  it("redacts secrets and tokens", () => {
    expect(
      redactMetadata({ activationToken: "abc", password: "secret", displayName: "Safe" }),
    ).toEqual({
      activationToken: "[REDACTED]",
      password: "[REDACTED]",
      displayName: "Safe",
    });
  });
});
