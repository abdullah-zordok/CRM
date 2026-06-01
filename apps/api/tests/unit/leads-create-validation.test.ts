import { describe, expect, it } from "vitest";
import {
  createLeadSchema,
  normalizeEmail,
  normalizePhone,
} from "../../src/modules/leads/leads.schemas.js";

describe("lead creation validation", () => {
  it("requires a name or company and at least one contact method", () => {
    const result = createLeadSchema.safeParse({
      sourceCode: "MANUAL_ENTRY",
      priority: "MEDIUM",
      ownerUserId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes email and phone for duplicate checks", () => {
    expect(normalizeEmail(" Lead@Example.COM ")).toBe("lead@example.com");
    expect(normalizePhone("(555) 123-4567")).toBe("5551234567");
  });
});
