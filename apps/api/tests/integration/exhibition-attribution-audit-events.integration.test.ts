import { ExhibitionDomainEventName, ExhibitionHistoryEntryType } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe("exhibition attribution audit and events", () => {
  it("declares attribution history entries and domain events", () => {
    expect(Object.values(ExhibitionHistoryEntryType)).toEqual(
      expect.arrayContaining(["LEAD_ATTRIBUTED", "ATTRIBUTION_CORRECTED", "ATTRIBUTION_REMOVED"]),
    );
    expect(Object.values(ExhibitionDomainEventName)).toEqual(
      expect.arrayContaining(["ExhibitionLeadAttributed", "ExhibitionAttributionCorrected"]),
    );
  });
});
