import { describe, expect, it } from "vitest";
import { mapExhibitionToSummaryDto } from "../../src/modules/exhibitions/exhibition.dto.js";

describe("exhibition summary integration contract", () => {
  it("exposes attendee and attribution counts in exhibition summaries", () => {
    const now = new Date("2026-06-02T10:00:00.000Z");
    const summary = mapExhibitionToSummaryDto({
      id: "exhibition-1",
      name: "Riyadh Expo",
      startsAt: now,
      endsAt: now,
      location: "Riyadh",
      status: "ACTIVE",
      ownerUserId: "owner-1",
      teamId: "team-1",
      notes: null,
      archiveReason: null,
      version: 1,
      createdByUserId: "admin-1",
      updatedByUserId: "admin-1",
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      correlationId: "correlation-1",
      _count: { attendees: 2, attributions: 3 },
    });

    expect(summary).toMatchObject({ attendeeCount: 2, attributedLeadCount: 3 });
  });
});
