import { describe, expect, it } from "vitest";
import {
  AssignExhibitionAttendeeSchema,
  AttributeLeadSchema,
  CreateExhibitionSchema,
  ExhibitionSearchSchema,
  UpdateExhibitionSchema,
} from "../../src/modules/exhibitions/exhibition.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("exhibition validation rules", () => {
  it("accepts complete exhibition creation input", () => {
    expect(
      CreateExhibitionSchema.safeParse({
        name: "Riyadh Expo",
        startsAt: "2026-06-10T09:00:00.000Z",
        endsAt: "2026-06-12T17:00:00.000Z",
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: uuid,
        notes: "Planning notes",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid date ranges before persistence", () => {
    expect(
      CreateExhibitionSchema.safeParse({
        name: "Bad Expo",
        startsAt: "2026-06-12T17:00:00.000Z",
        endsAt: "2026-06-10T09:00:00.000Z",
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: uuid,
      }).success,
    ).toBe(false);
  });

  it("allows partial updates but requires optimistic lock version", () => {
    expect(UpdateExhibitionSchema.safeParse({ location: "Jeddah", version: 2 }).success).toBe(true);
    expect(UpdateExhibitionSchema.safeParse({ location: "Jeddah" }).success).toBe(false);
  });

  it("bounds search pagination and parses numeric query strings", () => {
    const result = ExhibitionSearchSchema.parse({ page: "2", pageSize: "50" });
    expect(result).toMatchObject({ page: 2, pageSize: 50 });
    expect(ExhibitionSearchSchema.safeParse({ pageSize: "101" }).success).toBe(false);
  });

  it("validates attendee and attribution identifiers", () => {
    expect(AssignExhibitionAttendeeSchema.safeParse({ userId: uuid }).success).toBe(true);
    expect(AttributeLeadSchema.safeParse({ leadId: uuid, attributionType: "SOURCE" }).success).toBe(
      true,
    );
    expect(
      AttributeLeadSchema.safeParse({ leadId: "not-a-uuid", attributionType: "SOURCE" }).success,
    ).toBe(false);
  });
});
