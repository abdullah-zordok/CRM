import { describe, expect, it } from "vitest";
import {
  AssignExhibitionAttendeeSchema,
  ConfirmAttendanceSchema,
} from "../../src/modules/exhibitions/exhibition.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("exhibition attendance integration contract", () => {
  it("accepts attendee assignment and attendance confirmation commands", () => {
    expect(
      AssignExhibitionAttendeeSchema.safeParse({ userId: uuid, plannedRole: "Presenter" }).success,
    ).toBe(true);
    expect(ConfirmAttendanceSchema.safeParse({ status: "CONFIRMED", version: 1 }).success).toBe(
      true,
    );
  });
});
