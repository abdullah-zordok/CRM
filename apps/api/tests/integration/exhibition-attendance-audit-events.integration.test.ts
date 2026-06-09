import { ExhibitionDomainEventName, ExhibitionHistoryEntryType } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe("exhibition attendance audit and events", () => {
  it("declares attendance history entries and domain events", () => {
    expect(Object.values(ExhibitionHistoryEntryType)).toEqual(
      expect.arrayContaining(["ATTENDEE_ASSIGNED", "ATTENDANCE_CONFIRMED", "ATTENDANCE_CORRECTED"]),
    );
    expect(Object.values(ExhibitionDomainEventName)).toEqual(
      expect.arrayContaining(["ExhibitionAttendeeAssigned", "ExhibitionAttendanceConfirmed"]),
    );
  });
});
