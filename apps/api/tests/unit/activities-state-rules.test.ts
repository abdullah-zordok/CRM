import { describe, expect, it } from "vitest";
import { resolveActivityDueState } from "../../src/modules/leads/activities/activity.types.js";

describe("activity state rules", () => {
  const now = new Date("2026-06-01T12:00:00.000Z");

  it("marks completed and canceled states directly", () => {
    expect(resolveActivityDueState({ status: "COMPLETED", now })).toBe("COMPLETED");
    expect(resolveActivityDueState({ status: "CANCELED", now })).toBe("CANCELED");
  });

  it("marks due today and overdue planned activities", () => {
    expect(
      resolveActivityDueState({
        status: "PLANNED",
        dueAt: new Date("2026-06-01T15:00:00.000Z"),
        now,
      }),
    ).toBe("DUE_TODAY");
    expect(
      resolveActivityDueState({
        status: "PLANNED",
        dueAt: new Date("2026-05-31T15:00:00.000Z"),
        now,
      }),
    ).toBe("OVERDUE");
  });

  it("marks in-progress follow-ups unless they are overdue", () => {
    expect(
      resolveActivityDueState({
        status: "IN_PROGRESS",
        dueAt: new Date("2026-06-02T15:00:00.000Z"),
        now,
      }),
    ).toBe("IN_PROGRESS");
    expect(
      resolveActivityDueState({
        status: "IN_PROGRESS",
        dueAt: new Date("2026-05-31T15:00:00.000Z"),
        now,
      }),
    ).toBe("OVERDUE");
  });
});
