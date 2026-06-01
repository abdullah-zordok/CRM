import { describe, expect, it } from "vitest";
import { UsersSecurityAuditService } from "../../src/modules/users/audit/users-security-audit.service.js";
import { TeamMembershipService } from "../../src/modules/users/teams/team-membership.service.js";
import { TeamService } from "../../src/modules/users/teams/team.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("team scope", () => {
  it("creates a team", async () => {
    const repo = new UsersRepository();
    const service = new TeamService(
      repo,
      new TeamMembershipService(repo),
      new UsersSecurityAuditService(repo),
    );
    const team = await service.create({ name: "North" });
    expect(team.name).toBe("North");
  });
});
