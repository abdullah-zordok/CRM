import { describe, expect, it } from "vitest";
import { createActivitySchema } from "../../src/modules/leads/activities/activity.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("activity validation", () => {
  it("accepts a completed activity with outcome and activity time", () => {
    const result = createActivitySchema.safeParse({
      leadId: uuid,
      ownerUserId: uuid,
      type: "CALL",
      activityAt: new Date().toISOString(),
      outcome: "CONNECTED",
      note: "Spoke with customer about next steps.",
    });

    expect(result.success).toBe(true);
  });

  it("requires due date for planned follow-ups", () => {
    const result = createActivitySchema.safeParse({
      leadId: uuid,
      ownerUserId: uuid,
      type: "EMAIL",
    });

    expect(result.success).toBe(false);
  });

  it("rejects sensitive activity note text", () => {
    const result = createActivitySchema.safeParse({
      leadId: uuid,
      ownerUserId: uuid,
      type: "CALL",
      activityAt: new Date().toISOString(),
      outcome: "CONNECTED",
      note: "Customer password is ChangeMe123",
    });

    expect(result.success).toBe(false);
  });
});
