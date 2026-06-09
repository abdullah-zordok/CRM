import { describe, expect, it } from "vitest";
import { mapExhibitionToSummaryDto } from "../../src/modules/exhibitions/exhibition.dto.js";

describe("exhibition summary rules", () => {
  it("maps persisted counts into list summaries", () => {
    const now = new Date("2026-06-02T10:00:00.000Z");

    expect(
      mapExhibitionToSummaryDto({
        id: "exhibition-1",
        name: "Riyadh Expo",
        startsAt: now,
        endsAt: now,
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: "owner-1",
        teamId: "team-1",
        notes: null,
        archiveReason: null,
        version: 3,
        createdByUserId: "admin-1",
        updatedByUserId: "admin-1",
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
        correlationId: "correlation-1",
        _count: { attendees: 5, attributions: 8 },
      }),
    ).toMatchObject({
      id: "exhibition-1",
      attendeeCount: 5,
      attributedLeadCount: 8,
      version: 3,
    });
  });
});
