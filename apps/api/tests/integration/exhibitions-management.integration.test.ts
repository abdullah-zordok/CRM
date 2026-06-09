import { describe, expect, it } from "vitest";
import {
  ArchiveExhibitionSchema,
  CreateExhibitionSchema,
  RestoreExhibitionSchema,
  UpdateExhibitionSchema,
} from "../../src/modules/exhibitions/exhibition.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("exhibition management integration contract", () => {
  it("accepts create/update/archive/restore command shapes", () => {
    expect(
      CreateExhibitionSchema.safeParse({
        name: "Riyadh Expo",
        startsAt: "2026-06-10T09:00:00.000Z",
        endsAt: "2026-06-11T09:00:00.000Z",
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: uuid,
      }).success,
    ).toBe(true);
    expect(UpdateExhibitionSchema.safeParse({ status: "ACTIVE", version: 1 }).success).toBe(true);
    expect(ArchiveExhibitionSchema.safeParse({ version: 1, reason: "Canceled" }).success).toBe(
      true,
    );
    expect(
      RestoreExhibitionSchema.safeParse({ version: 2, restoredStatus: "PLANNED" }).success,
    ).toBe(true);
  });
});
