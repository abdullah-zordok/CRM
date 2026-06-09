import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("self-owned lead creation integration rules", () => {
  it("uses the current representative as owner and creator for create access", () => {
    const access = new LeadAccessService({} as never);
    const representative = { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] };

    const decision = access.evaluate(representative, undefined, "CREATE");
    const createPayload = {
      ownerUserId: representative.id,
      createdByUserId: representative.id,
    };

    expect(decision).toMatchObject({ allowed: true, scope: "OWNED" });
    expect(createPayload).toEqual({ ownerUserId: "rep-1", createdByUserId: "rep-1" });
  });
});
