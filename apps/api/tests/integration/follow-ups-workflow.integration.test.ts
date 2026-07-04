import { describe, expect, it } from "vitest";
import {
  completeActivitySchema,
  createActivitySchema,
} from "../../src/modules/leads/activities/activity.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("follow-up workflow contract", () => {
  it("accepts planned follow-up and completion payloads", () => {
    expect(
      createActivitySchema.safeParse({
        leadId: uuid,
        ownerUserId: uuid,
        type: "CALL",
        dueAt: new Date().toISOString(),
      }).success,
    ).toBe(true);

    expect(
      completeActivitySchema.safeParse({
        version: 1,
        outcome: "CONNECTED",
        completedAt: new Date().toISOString(),
      }).success,
    ).toBe(true);
  });
});
