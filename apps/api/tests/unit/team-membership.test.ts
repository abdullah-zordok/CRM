import { describe, expect, it } from "vitest";
import { TeamMembershipService } from "../../src/modules/users/teams/team-membership.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("TeamMembershipService", () => {
  it("keeps one active team membership per user", async () => {
    const repo = new UsersRepository();
    const service = new TeamMembershipService(repo);
    const userId = "00000000-0000-4000-8000-000000000001";
    const now = new Date();
    const teamA = await repo.saveTeam({
      id: repo.nextId(),
      name: "A",
      status: "ACTIVE",
      members: [],
      createdAt: now,
      updatedAt: now,
    });
    const teamB = await repo.saveTeam({
      id: repo.nextId(),
      name: "B",
      status: "ACTIVE",
      members: [],
      createdAt: now,
      updatedAt: now,
    });

    await service.moveUserToTeam(userId, teamA.id, "MEMBER");
    await service.moveUserToTeam(userId, teamB.id, "MEMBER");

    expect((await repo.activeMembershipForUser(userId))?.team.id).toBe(teamB.id);
    expect((await repo.findTeam(teamA.id))?.members[0]?.status).toBe("ENDED");
  });
});
