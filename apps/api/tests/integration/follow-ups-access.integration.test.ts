import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("follow-up access rules", () => {
  it("allows managers to reassign follow-ups in team scope", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        {
          id: "manager-1",
          status: "ACTIVE",
          roles: ["MANAGER"],
          activeTeam: { id: "team-1", name: "Team 1", status: "ACTIVE" },
        },
        { ownerUserId: "rep-1", teamId: "team-1" },
        "ACTIVITY_REASSIGN",
      ),
    ).toMatchObject({ allowed: true, scope: "TEAM" });
  });
});
