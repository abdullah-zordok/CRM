import { ConflictException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { LeadDuplicateService } from "../../src/modules/leads/leads-duplicate.service.js";

describe("lead duplicate detection", () => {
  it("uses privacy-safe conflicts for restricted duplicates", async () => {
    const service = new LeadDuplicateService(
      {
        findActiveDuplicate: async () => ({
          id: "lead-1",
          ownerUserId: "other-user",
          teamId: null,
        }),
      } as never,
      {
        evaluate: () => ({ allowed: false, scope: "NONE", reason: "DEFAULT_DENY" }),
      } as never,
    );

    await expect(
      service.assertNoActiveDuplicate({ email: "lead@example.com" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
