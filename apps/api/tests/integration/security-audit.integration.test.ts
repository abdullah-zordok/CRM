import { describe, expect, it } from "vitest";
import { SecurityAuditOutcome } from "@prisma/client";

describe("security audit", () => {
  it("tracks required audit event outcomes", () => {
    expect(Object.values(SecurityAuditOutcome)).toEqual(
      expect.arrayContaining(["SUCCESS", "FAILURE", "DENIED"]),
    );
  });
});
