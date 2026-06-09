import { describe, expect, it } from "vitest";
import { createActivitySchema } from "../../src/modules/leads/activities/activity.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("activities create integration contract", () => {
  it("accepts completed activity creation payloads", () => {
    const result = createActivitySchema.safeParse({
      leadId: uuid,
      ownerUserId: uuid,
      type: "CALL",
      activityAt: new Date().toISOString(),
      outcome: "CONNECTED",
    });

    expect(result.success).toBe(true);
  });
});
