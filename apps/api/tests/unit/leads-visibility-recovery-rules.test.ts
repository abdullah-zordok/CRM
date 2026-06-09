import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("lead visibility recovery rules", () => {
  const access = new LeadAccessService({} as never);

  it("allows Admin global, Manager team, and representative owned scopes", () => {
    expect(
      access.evaluate(
        { id: "admin-1", status: "ACTIVE", roles: ["ADMIN"] },
        { ownerUserId: "rep-1", teamId: "team-a" },
        "VIEW",
      ),
    ).toMatchObject({ allowed: true, scope: "GLOBAL" });

    expect(
      access.evaluate(
        {
          id: "manager-1",
          status: "ACTIVE",
          roles: ["MANAGER"],
          activeTeam: { id: "team-a", name: "Team A", status: "ACTIVE" },
        },
        { ownerUserId: "rep-1", teamId: "team-a" },
        "VIEW",
      ),
    ).toMatchObject({ allowed: true, scope: "TEAM" });

    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        { ownerUserId: "rep-1", teamId: "team-a" },
        "VIEW",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED" });
  });

  it("default-denies out-of-scope lead details", () => {
    expect(
      access.evaluate(
        { id: "rep-1", status: "ACTIVE", roles: ["SALES_REPRESENTATIVE"] },
        { ownerUserId: "rep-2", teamId: "team-a" },
        "VIEW",
      ),
    ).toMatchObject({ allowed: false, scope: "NONE" });
  });
});
