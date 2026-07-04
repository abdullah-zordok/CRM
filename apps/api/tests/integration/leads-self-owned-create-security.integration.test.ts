import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("self-owned lead creation security rules", () => {
  it("denies representative assignment overrides while allowing own create", () => {
    const access = new LeadAccessService({} as never);
    const representative = { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] };

    expect(access.evaluate(representative, undefined, "CREATE")).toMatchObject({
      allowed: true,
      scope: "OWNED",
    });
    expect(
      access.evaluate(representative, { ownerUserId: "rep-2", teamId: null }, "ASSIGN"),
    ).toMatchObject({ allowed: false, reason: "DEFAULT_DENY" });
  });
});
