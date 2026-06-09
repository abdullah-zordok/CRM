import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("lead visibility recovery security rules", () => {
  it("returns a default denial reason for hidden lead context", () => {
    const access = new LeadAccessService({} as never);

    expect(
      access.evaluate(
        {
          id: "manager-1",
          status: "ACTIVE",
          roles: ["MANAGER"],
          activeTeam: { id: "team-a", name: "Team A", status: "ACTIVE" },
        },
        { ownerUserId: "rep-2", teamId: "team-b" },
        "VIEW",
      ),
    ).toMatchObject({ allowed: false, reason: "DEFAULT_DENY" });
  });
});
