import { describe, expect, it } from "vitest";
import { ExhibitionAccessService } from "../../src/modules/exhibitions/exhibition-access.service.js";

describe("exhibition attendance access integration", () => {
  it("allows representatives to confirm only their own attendance", () => {
    const access = new ExhibitionAccessService({} as never);
    const rep = {
      id: "rep-1",
      email: "rep@example.com",
      displayName: "Rep",
      status: "ACTIVE",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: false,
      sessionId: "session-1",
    };

    expect(
      access.evaluate(rep, undefined, undefined, ["rep-1"], "CONFIRM_ATTENDANCE"),
    ).toMatchObject({ allowed: true, scope: "ATTENDEE" });
    expect(
      access.evaluate(rep, undefined, undefined, ["rep-2"], "CONFIRM_ATTENDANCE"),
    ).toMatchObject({ allowed: false });
  });
});
