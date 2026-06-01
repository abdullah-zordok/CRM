import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersSecurityAuditService } from "../audit/users-security-audit.service.js";
import { UsersRepository } from "../users.repository.js";
import type {
  CreateTeamInput,
  ReplaceTeamMembersInput,
  UpdateTeamInput,
} from "../users.schemas.js";
import { TeamMembershipService } from "./team-membership.service.js";

@Injectable()
export class TeamService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly memberships: TeamMembershipService,
    private readonly audit: UsersSecurityAuditService,
  ) {}

  list() {
    return this.repository.listTeams();
  }

  async create(input: CreateTeamInput, actorUserId = "system") {
    if (
      (await this.repository.listTeams()).some(
        (team) => team.name.toLowerCase() === input.name.toLowerCase() && team.status === "ACTIVE",
      )
    ) {
      throw new ConflictException("Active team name already exists");
    }
    const now = new Date();
    const team = await this.repository.saveTeam({
      id: this.repository.nextId(),
      name: input.name,
      status: "ACTIVE",
      members: [],
      createdAt: now,
      updatedAt: now,
    });
    await this.audit.record({
      eventType: "TEAM_CREATED",
      actorUserId,
      resource: "teams",
      metadata: { teamId: team.id },
    });
    return team;
  }

  async update(teamId: string, input: UpdateTeamInput, actorUserId = "system") {
    const team = await this.repository.findTeam(teamId);
    if (!team) throw new NotFoundException("Team not found");
    const updated = await this.repository.saveTeam({
      ...team,
      name: input.name ?? team.name,
      status: input.status ?? team.status,
      deactivatedAt: input.status === "INACTIVE" ? new Date() : team.deactivatedAt,
      updatedAt: new Date(),
    });
    await this.audit.record({
      eventType: input.status === "INACTIVE" ? "TEAM_DEACTIVATED" : "TEAM_UPDATED",
      actorUserId,
      resource: "teams",
      metadata: { teamId },
    });
    return updated;
  }

  async replaceMembers(teamId: string, input: ReplaceTeamMembersInput, actorUserId = "system") {
    const team = await this.repository.findTeam(teamId);
    if (!team) throw new NotFoundException("Team not found");
    for (const member of input.members) {
      await this.memberships.moveUserToTeam(
        member.userId,
        teamId,
        member.membershipType,
        actorUserId,
      );
    }
    await this.audit.record({
      eventType: "TEAM_MEMBERSHIP_CHANGED",
      actorUserId,
      resource: "teams",
      metadata: { teamId, members: input.members },
    });
    return (await this.repository.findTeam(teamId))!;
  }
}
