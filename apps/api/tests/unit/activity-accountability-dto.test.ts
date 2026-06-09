import { describe, expect, it } from "vitest";
import { toActivityDetailDto } from "../../src/modules/leads/activities/activity.dto.js";

describe("activity accountability DTO", () => {
  it("separates completed activities from follow-ups and exposes accountability names", () => {
    const activity = toActivityDetailDto(
      {
        id: "activity-1",
        leadId: "lead-1",
        lead: { displayName: "Ali Ahmed" },
        type: "CALL",
        status: "COMPLETED",
        ownerUserId: "owner-1",
        owner: { id: "owner-1", displayName: "Ali Ahmed" },
        recordedByUserId: "recorder-1",
        recorder: { id: "recorder-1", displayName: "Abdullah Zordok" },
        teamId: null,
        activityAt: new Date("2026-06-12T09:00:00.000Z"),
        dueAt: null,
        completedAt: null,
        canceledAt: null,
        outcome: "CONNECTED",
        note: "Customer requested product pricing.",
        cancellationReason: null,
        version: 1,
        correlationId: "test",
        createdAt: new Date("2026-06-12T09:05:00.000Z"),
        updatedAt: new Date("2026-06-12T09:05:00.000Z"),
      } as never,
      "test",
    );

    expect(activity).toMatchObject({
      kind: "ACTIVITY",
      followUpStatus: null,
      recordedByDisplayName: "Abdullah Zordok",
      ownerDisplayName: "Ali Ahmed",
      recordedAt: "2026-06-12T09:05:00.000Z",
    });
  });

  it("maps planned follow-ups to pending business status", () => {
    const followUp = toActivityDetailDto(
      {
        id: "follow-up-1",
        leadId: "lead-1",
        lead: { displayName: "Ali Ahmed" },
        type: "EMAIL",
        status: "PLANNED",
        ownerUserId: "owner-1",
        owner: { id: "owner-1", displayName: "Ali Ahmed" },
        recordedByUserId: "creator-1",
        recorder: { id: "creator-1", displayName: "Abdullah Zordok" },
        teamId: null,
        activityAt: null,
        dueAt: new Date("2026-06-20T09:00:00.000Z"),
        completedAt: null,
        canceledAt: null,
        outcome: null,
        note: "Send pricing proposal and product brochure.",
        cancellationReason: null,
        version: 1,
        correlationId: "test",
        createdAt: new Date("2026-06-12T09:05:00.000Z"),
        updatedAt: new Date("2026-06-12T09:05:00.000Z"),
      } as never,
      "test",
    );

    expect(followUp).toMatchObject({
      kind: "FOLLOW_UP",
      followUpStatus: "PENDING",
      recordedByDisplayName: "Abdullah Zordok",
      ownerDisplayName: "Ali Ahmed",
    });
  });
});
