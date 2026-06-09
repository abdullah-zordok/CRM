import { describe, expect, it } from "vitest";
import { ExhibitionFormSchema } from "../../features/exhibitions/validation/exhibitions-validation";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("exhibition form validation", () => {
  it("accepts valid exhibition form values", () => {
    expect(
      ExhibitionFormSchema.safeParse({
        name: "Riyadh Expo",
        startsAt: "2026-06-10T09:00",
        endsAt: "2026-06-12T17:00",
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: uuid,
      }).success,
    ).toBe(true);
  });

  it("rejects missing names and inverted date ranges", () => {
    expect(
      ExhibitionFormSchema.safeParse({
        name: "",
        startsAt: "2026-06-12T17:00",
        endsAt: "2026-06-10T09:00",
        location: "Riyadh",
        status: "PLANNED",
        ownerUserId: uuid,
      }).success,
    ).toBe(false);
  });
});
