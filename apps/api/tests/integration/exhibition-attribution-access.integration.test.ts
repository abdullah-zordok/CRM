import { describe, expect, it } from "vitest";
import { ExhibitionAccessService } from "../../src/modules/exhibitions/exhibition-access.service.js";

describe("exhibition attribution access integration", () => {
  it("allows representatives to attribute owned leads but denies unrelated leads", () => {
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
      access.evaluate(
        rep,
        { ownerUserId: "owner-1", teamId: null },
        { id: "lead-1", ownerUserId: "rep-1", teamId: null },
        undefined,
        "ATTRIBUTE_LEAD",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED_LEAD" });
    expect(
      access.evaluate(
        rep,
        { ownerUserId: "owner-1", teamId: null },
        { id: "lead-1", ownerUserId: "rep-2", teamId: null },
        undefined,
        "ATTRIBUTE_LEAD",
      ),
    ).toMatchObject({ allowed: false });
  });
});
