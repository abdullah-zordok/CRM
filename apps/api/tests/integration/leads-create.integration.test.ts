import { describe, expect, it } from "vitest";
import { createLeadSchema } from "../../src/modules/leads/leads.schemas.js";

describe("lead create integration contract", () => {
  it("accepts a complete lead creation payload", () => {
    const result = createLeadSchema.safeParse({
      displayName: "Acme Lead",
      email: "lead@example.com",
      sourceCode: "MANUAL_ENTRY",
      priority: "MEDIUM",
      ownerUserId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(true);
  });
});
