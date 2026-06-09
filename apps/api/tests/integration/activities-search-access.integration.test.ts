import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("activities search access", () => {
  it("allows sales representatives to search within owned activity scope", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        undefined,
        "ACTIVITY_SEARCH",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED" });
  });
});
