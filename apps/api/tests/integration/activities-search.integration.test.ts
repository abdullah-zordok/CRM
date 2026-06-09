import { describe, expect, it } from "vitest";
import { activitySearchSchema } from "../../src/modules/leads/activities/activity.schemas.js";

describe("activities search query", () => {
  it("accepts manager review filters", () => {
    const result = activitySearchSchema.safeParse({
      type: "CALL",
      dueState: "OVERDUE",
      page: "1",
      pageSize: "25",
    });

    expect(result.success).toBe(true);
  });
});
