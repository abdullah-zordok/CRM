import { describe, expect, it } from "vitest";
import { isEligibleLeadAssignee } from "../../src/modules/leads/assignment/lead-assignment.service.js";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("self-owned lead creation rules", () => {
  it("allows active sales representatives to create leads in owned scope", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        undefined,
        "CREATE",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED" });
  });

  it("bypasses alternate owner eligibility by treating the current representative as owner", () => {
    expect(isEligibleLeadAssignee({ status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] })).toBe(
      true,
    );
    expect(isEligibleLeadAssignee({ status: "ACTIVE", roles: ["MANAGER"] })).toBe(false);
  });
});
