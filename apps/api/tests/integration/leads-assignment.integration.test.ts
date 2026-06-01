import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";
import { isEligibleLeadAssignee } from "../../src/modules/leads/assignment/lead-assignment.service.js";

describe("lead assignment integration rules", () => {
  it("supports Admin cross-team assignment decisions", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        { id: "admin-1", status: "ACTIVE", roles: ["ADMIN"] },
        { ownerUserId: "rep-1", teamId: "team-a" },
        "ASSIGN",
      ),
    ).toMatchObject({ allowed: true, scope: "GLOBAL" });
  });

  it("blocks manager assignment outside the manager team scope", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        {
          id: "manager-1",
          status: "ACTIVE",
          roles: ["MANAGER"],
          activeTeam: { id: "team-a", name: "Team A", status: "ACTIVE" },
        },
        { ownerUserId: "rep-1", teamId: "team-b" },
        "ASSIGN",
      ),
    ).toMatchObject({ allowed: false, reason: "DEFAULT_DENY" });
  });

  it("rejects disabled assignees before assignment history can be written", () => {
    expect(isEligibleLeadAssignee({ status: "DISABLED", roles: ["SALES_REPRESENTATIVE"] })).toBe(
      false,
    );
  });
});
