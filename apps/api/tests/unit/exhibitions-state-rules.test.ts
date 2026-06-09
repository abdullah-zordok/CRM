import { describe, expect, it } from "vitest";
import {
  ArchiveExhibitionSchema,
  ConfirmAttendanceSchema,
  CorrectAttributionSchema,
  RestoreExhibitionSchema,
  UpdateExhibitionSchema,
} from "../../src/modules/exhibitions/exhibition.schemas.js";

describe("exhibition state rules", () => {
  it("requires versions for exhibition, attendance, and attribution mutations", () => {
    expect(UpdateExhibitionSchema.safeParse({ status: "ACTIVE", version: 1 }).success).toBe(true);
    expect(UpdateExhibitionSchema.safeParse({ status: "ACTIVE" }).success).toBe(false);
    expect(ConfirmAttendanceSchema.safeParse({ status: "CONFIRMED", version: 1 }).success).toBe(
      true,
    );
    expect(CorrectAttributionSchema.safeParse({ status: "REMOVED", version: 1 }).success).toBe(
      true,
    );
  });

  it("validates archive and restore commands", () => {
    expect(ArchiveExhibitionSchema.safeParse({ reason: "Canceled", version: 1 }).success).toBe(
      true,
    );
    expect(
      RestoreExhibitionSchema.safeParse({ restoredStatus: "PLANNED", version: 2 }).success,
    ).toBe(true);
    expect(
      RestoreExhibitionSchema.safeParse({ restoredStatus: "INVALID", version: 2 }).success,
    ).toBe(false);
  });

  it("limits attendance and attribution correction reason length", () => {
    const tooLong = "x".repeat(501);
    expect(
      ConfirmAttendanceSchema.safeParse({
        status: "CORRECTED",
        correctionReason: tooLong,
        version: 1,
      }).success,
    ).toBe(false);
    expect(
      CorrectAttributionSchema.safeParse({
        status: "CORRECTED",
        correctionReason: tooLong,
        version: 1,
      }).success,
    ).toBe(false);
  });
});
