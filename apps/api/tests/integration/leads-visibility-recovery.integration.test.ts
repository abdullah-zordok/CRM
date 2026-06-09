import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("lead visibility recovery integration rules", () => {
  it("mirrors lead scope for activity and follow-up reads", () => {
    const access = new LeadAccessService({} as never);
    const manager = {
      id: "manager-1",
      status: "ACTIVE",
      roles: ["MANAGER"],
      activeTeam: { id: "team-a", name: "Team A", status: "ACTIVE" },
    };

    expect(
      access.evaluate(manager, { ownerUserId: "rep-1", teamId: "team-a" }, "ACTIVITY_VIEW"),
    ).toMatchObject({ allowed: true, scope: "TEAM" });
    expect(
      access.evaluate(manager, { ownerUserId: "rep-2", teamId: "team-b" }, "ACTIVITY_VIEW"),
    ).toMatchObject({ allowed: false, scope: "NONE" });
  });
});
