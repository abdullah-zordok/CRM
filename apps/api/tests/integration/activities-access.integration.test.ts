import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("activities access rules", () => {
  it("allows sales representatives to create activities for owned leads", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        { ownerUserId: "rep-1", teamId: null },
        "ACTIVITY_CREATE",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED" });
  });

  it("denies sales representatives reassigning follow-ups", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        { ownerUserId: "rep-1", teamId: null },
        "ACTIVITY_REASSIGN",
      ),
    ).toMatchObject({ allowed: false, scope: "NONE" });
  });
});
