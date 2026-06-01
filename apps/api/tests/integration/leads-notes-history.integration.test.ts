import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("lead notes and history integration rules", () => {
  it("uses lead scope for note and history access", () => {
    const access = new LeadAccessService({} as never);
    const user = { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] };
    const lead = { ownerUserId: "rep-1", teamId: null };

    expect(access.evaluate(user, lead, "ADD_NOTE")).toMatchObject({ allowed: true });
    expect(access.evaluate(user, lead, "VIEW_HISTORY")).toMatchObject({ allowed: true });
    expect(access.evaluate(user, { ownerUserId: "rep-2", teamId: null }, "ADD_NOTE")).toMatchObject(
      { allowed: false },
    );
  });
});
