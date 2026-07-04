import { ExhibitionDomainEventName, ExhibitionHistoryEntryType } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe("exhibitions audit and event integration contract", () => {
  it("declares management history entries and domain events", () => {
    expect(Object.values(ExhibitionHistoryEntryType)).toEqual(
      expect.arrayContaining(["CREATED", "UPDATED", "ARCHIVED", "RESTORED"]),
    );
    expect(Object.values(ExhibitionDomainEventName)).toEqual(
      expect.arrayContaining(["ExhibitionCreated", "ExhibitionUpdated", "ExhibitionStatusChanged"]),
    );
  });
});
