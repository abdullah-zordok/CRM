import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";
import { isEligibleLeadAssignee } from "../../src/modules/leads/assignment/lead-assignment.service.js";

describe("lead assignment rules", () => {
  it("allows managers to assign leads in their team scope", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        {
          id: "manager-1",
          status: "ACTIVE",
          roles: ["MANAGER"],
          activeTeam: { id: "team-1", name: "Sales", status: "ACTIVE" },
        },
        { ownerUserId: "rep-1", teamId: "team-1" },
        "ASSIGN",
      ),
    ).toMatchObject({ allowed: true, scope: "TEAM" });
  });

  it("denies sales representatives assigning leads to others", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        { ownerUserId: "rep-1", teamId: null },
        "ASSIGN",
      ),
    ).toMatchObject({ allowed: false, scope: "NONE" });
  });

  it("requires active sales representatives as assignees", () => {
    expect(isEligibleLeadAssignee({ status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] })).toBe(
      true,
    );
    expect(isEligibleLeadAssignee({ status: "DISABLED", roles: ["SALES_REPRESENTATIVE"] })).toBe(
      false,
    );
    expect(isEligibleLeadAssignee({ status: "ACTIVE", roles: ["MANAGER"] })).toBe(false);
  });
});
