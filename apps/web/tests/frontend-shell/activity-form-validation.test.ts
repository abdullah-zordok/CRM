import { describe, expect, it } from "vitest";
import { completedActivityFormSchema } from "../../features/activities/validation/activity-validation";

describe("completed activity form validation", () => {
  it("accepts valid completed activity input", () => {
    const result = completedActivityFormSchema.safeParse({
      type: "CALL",
      activityAt: "2026-06-01T10:00",
      outcome: "CONNECTED",
      note: "Customer asked for a proposal.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing activity time", () => {
    const result = completedActivityFormSchema.safeParse({
      type: "CALL",
      activityAt: "",
      outcome: "CONNECTED",
    });

    expect(result.success).toBe(false);
  });

  it("rejects sensitive notes", () => {
    const result = completedActivityFormSchema.safeParse({
      type: "CALL",
      activityAt: "2026-06-01T10:00",
      outcome: "CONNECTED",
      note: "password is hidden",
    });

    expect(result.success).toBe(false);
  });
});
