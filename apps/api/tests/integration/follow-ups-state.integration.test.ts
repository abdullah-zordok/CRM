import { describe, expect, it } from "vitest";
import {
  cancelActivitySchema,
  reassignActivitySchema,
} from "../../src/modules/leads/activities/activity.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("follow-up state contract", () => {
  it("requires version for reassignment and cancellation", () => {
    expect(reassignActivitySchema.safeParse({ version: 1, ownerUserId: uuid }).success).toBe(true);
    expect(cancelActivitySchema.safeParse({ version: 1, reason: "No longer needed" }).success).toBe(
      true,
    );
    expect(reassignActivitySchema.safeParse({ ownerUserId: uuid }).success).toBe(false);
  });
});
