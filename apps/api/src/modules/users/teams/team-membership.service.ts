import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../users.repository.js";
import type { TeamMembershipType } from "../users.types.js";

@Injectable()
export class TeamMembershipService {
  constructor(private readonly repository: UsersRepository) {}

  async moveUserToTeam(
    userId: string,
    teamId: string,
    membershipType: TeamMembershipType,
    actorUserId = "system",
  ) {
    const user = await this.repository.findUser(userId);
    const team = await this.repository.findTeam(teamId);
    if (!user) throw new NotFoundException("User not found");
    if (!team) throw new NotFoundException("Team not found");
    if (team.status !== "ACTIVE")
      throw new BadRequestException("Inactive teams cannot receive members");
    if (membershipType === "MANAGER" && !user.roles.includes("MANAGER")) {
      throw new BadRequestException("Manager membership requires Manager role");
    }

    return this.repository.moveUserToTeam(userId, teamId, membershipType, actorUserId);
  }
}
