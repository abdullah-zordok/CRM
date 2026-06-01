import { randomUUID } from "node:crypto";
import { Injectable, Optional } from "@nestjs/common";
import type {
  AuthSessionRevocationReason,
  BusinessRoleCode as PrismaBusinessRoleCode,
  PlatformUserStatus,
  SecurityAuditOutcome,
  TeamStatus as PrismaTeamStatus,
} from "@prisma/client";
import {
  AssignmentStatus,
  AuthSessionStatus,
  TeamMembershipStatus,
  type Prisma,
} from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type { BusinessRoleCode } from "./permissions/permission-codes.js";
import type {
  AccessDecisionRecord,
  ActivationRecord,
  AuthSessionRecord,
  PlatformUserRecord,
  SecurityAuditRecord,
  TeamMemberRecord,
  TeamMembershipType,
  TeamRecord,
} from "./users.types.js";

type UserWithRelations = Prisma.PlatformUserGetPayload<{
  include: {
    roleAssignments: true;
    reviewerAssignments: true;
    teamMemberships: { include: { team: true } };
  };
}>;

type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    memberships: {
      include: {
        user: true;
      };
    };
  };
}>;

@Injectable()
export class UsersRepository {
  readonly users = new Map<string, PlatformUserRecord>();
  readonly activations = new Map<string, ActivationRecord>();
  readonly sessions = new Map<string, AuthSessionRecord>();
  readonly teams = new Map<string, TeamRecord>();
  readonly accessDecisions: AccessDecisionRecord[] = [];
  readonly audits: SecurityAuditRecord[] = [];

  constructor(@Optional() private readonly prisma?: PrismaService) {
    if (!prisma) {
      const now = new Date();
      const admin: PlatformUserRecord = {
        id: "00000000-0000-4000-8000-000000000001",
        email: "admin@example.com",
        displayName: "Seeded Admin",
        status: "ACTIVE",
        roles: ["ADMIN"],
        hasReviewerAccess: false,
        activatedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(admin.id, admin);
    }
  }

  nextId(): string {
    return randomUUID();
  }

  async findUser(id: string): Promise<PlatformUserRecord | undefined> {
    if (!this.prisma) return this.users.get(id);
    const user = await this.prisma.platformUser.findUnique({
      where: { id },
      include: this.userInclude(),
    });
    return user ? this.mapUser(user) : undefined;
  }

  async findUserByEmail(email: string): Promise<PlatformUserRecord | undefined> {
    if (!this.prisma) {
      return [...this.users.values()].find((user) => user.email === email.toLowerCase());
    }
    const user = await this.prisma.platformUser.findUnique({
      where: { email: email.toLowerCase() },
      include: this.userInclude(),
    });
    return user ? this.mapUser(user) : undefined;
  }

  async saveUser(user: PlatformUserRecord): Promise<PlatformUserRecord> {
    if (!this.prisma) {
      this.users.set(user.id, { ...user, email: user.email.toLowerCase(), updatedAt: new Date() });
      return this.users.get(user.id)!;
    }

    await this.prisma.platformUser.upsert({
      where: { id: user.id },
      update: {
        email: user.email.toLowerCase(),
        displayName: user.displayName,
        passwordHash: user.passwordHash,
        status: user.status as PlatformUserStatus,
        activatedAt: user.activatedAt,
        disabledAt: user.disabledAt,
      },
      create: {
        id: user.id,
        email: user.email.toLowerCase(),
        displayName: user.displayName,
        passwordHash: user.passwordHash,
        status: user.status as PlatformUserStatus,
        activatedAt: user.activatedAt,
        disabledAt: user.disabledAt,
      },
    });
    await this.syncRoles(user.id, user.roles);
    await this.syncReviewerAccess(user.id, user.hasReviewerAccess);
    return (await this.findUser(user.id))!;
  }

  async listUsers(): Promise<PlatformUserRecord[]> {
    if (!this.prisma) return [...this.users.values()];
    const users = await this.prisma.platformUser.findMany({
      include: this.userInclude(),
      orderBy: { createdAt: "desc" },
    });
    return users.map((user) => this.mapUser(user));
  }

  async saveActivation(record: ActivationRecord): Promise<ActivationRecord> {
    if (!this.prisma) {
      this.activations.set(record.tokenHash, record);
      return record;
    }
    const saved = await this.prisma.activationToken.create({
      data: {
        id: record.id,
        userId: record.userId,
        tokenHash: record.tokenHash,
        status: record.status,
        expiresAt: record.expiresAt,
        createdByUserId: this.normalizeUuid(record.createdByUserId),
      },
    });
    return { ...record, id: saved.id, rawToken: record.rawToken };
  }

  async findActivation(tokenHash: string): Promise<ActivationRecord | undefined> {
    if (!this.prisma) return this.activations.get(tokenHash);
    const token = await this.prisma.activationToken.findUnique({ where: { tokenHash } });
    return token
      ? {
          id: token.id,
          userId: token.userId,
          tokenHash: token.tokenHash,
          status: token.status,
          expiresAt: token.expiresAt,
          usedAt: token.usedAt ?? undefined,
          revokedAt: token.revokedAt ?? undefined,
          createdByUserId: token.createdByUserId ?? undefined,
          createdAt: token.createdAt,
        }
      : undefined;
  }

  async activeActivationsForUser(userId: string): Promise<ActivationRecord[]> {
    if (!this.prisma) {
      return [...this.activations.values()].filter(
        (token) => token.userId === userId && token.status === "ACTIVE",
      );
    }
    const tokens = await this.prisma.activationToken.findMany({
      where: { userId, status: "ACTIVE" },
    });
    return tokens.map((token) => ({
      id: token.id,
      userId: token.userId,
      tokenHash: token.tokenHash,
      status: token.status,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt ?? undefined,
      revokedAt: token.revokedAt ?? undefined,
      createdByUserId: token.createdByUserId ?? undefined,
      createdAt: token.createdAt,
    }));
  }

  async markActivation(record: ActivationRecord): Promise<void> {
    if (!this.prisma) return;
    await this.prisma.activationToken.update({
      where: { tokenHash: record.tokenHash },
      data: {
        status: record.status,
        usedAt: record.usedAt,
        revokedAt: record.revokedAt,
      },
    });
  }

  async saveSession(record: AuthSessionRecord): Promise<AuthSessionRecord> {
    if (!this.prisma) {
      this.sessions.set(record.id, record);
      return record;
    }
    await this.prisma.authSession.update({
      where: { id: record.id },
      data: {
        status: record.status as AuthSessionStatus,
        revokedAt: record.revokedAt,
        revocationReason: record.revocationReason as AuthSessionRevocationReason | undefined,
      },
    });
    return record;
  }

  async activeSessionsForUser(userId: string): Promise<AuthSessionRecord[]> {
    if (!this.prisma) {
      return [...this.sessions.values()].filter(
        (session) => session.userId === userId && session.status === "ACTIVE",
      );
    }
    const sessions = await this.prisma.authSession.findMany({
      where: { userId, status: AuthSessionStatus.ACTIVE },
    });
    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      sessionHash: session.sessionHash,
      status: session.status,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt ?? undefined,
      revocationReason: session.revocationReason ?? undefined,
    }));
  }

  async saveTeam(team: TeamRecord): Promise<TeamRecord> {
    if (!this.prisma) {
      this.teams.set(team.id, team);
      return team;
    }
    const saved = await this.prisma.team.upsert({
      where: { id: team.id },
      update: {
        name: team.name,
        status: team.status as PrismaTeamStatus,
        deactivatedAt: team.deactivatedAt,
      },
      create: {
        id: team.id,
        name: team.name,
        status: team.status as PrismaTeamStatus,
        deactivatedAt: team.deactivatedAt,
      },
      include: this.teamInclude(),
    });
    return this.mapTeam(saved);
  }

  async listTeams(): Promise<TeamRecord[]> {
    if (!this.prisma) return [...this.teams.values()];
    const teams = await this.prisma.team.findMany({
      include: this.teamInclude(),
      orderBy: { createdAt: "desc" },
    });
    return teams.map((team) => this.mapTeam(team));
  }

  async findTeam(id: string): Promise<TeamRecord | undefined> {
    if (!this.prisma) return this.teams.get(id);
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: this.teamInclude(),
    });
    return team ? this.mapTeam(team) : undefined;
  }

  async activeMembershipForUser(
    userId: string,
  ): Promise<{ team: TeamRecord; member: TeamMemberRecord } | undefined> {
    if (!this.prisma) {
      for (const team of this.teams.values()) {
        const member = team.members.find(
          (item) => item.userId === userId && item.status === "ACTIVE",
        );
        if (member) return { team, member };
      }
      return undefined;
    }
    const membership = await this.prisma.teamMembership.findFirst({
      where: { userId, status: TeamMembershipStatus.ACTIVE },
      include: { team: { include: this.teamInclude() }, user: true },
    });
    if (!membership) return undefined;
    return {
      team: this.mapTeam(membership.team),
      member: {
        userId: membership.userId,
        displayName: membership.user.displayName,
        membershipType: membership.membershipType,
        status: membership.status,
        assignedAt: membership.assignedAt,
        endedAt: membership.endedAt ?? undefined,
      },
    };
  }

  async moveUserToTeam(
    userId: string,
    teamId: string,
    membershipType: TeamMembershipType,
    actorUserId?: string,
  ): Promise<TeamRecord> {
    if (!this.prisma) {
      const user = this.users.get(userId);
      const team = this.teams.get(teamId);
      if (!user || !team) throw new Error("User or team not found");
      const existing = await this.activeMembershipForUser(userId);
      if (existing) {
        existing.member.status = "ENDED";
        existing.member.endedAt = new Date();
      }
      team.members.push({
        userId,
        displayName: user.displayName,
        membershipType,
        status: "ACTIVE",
        assignedAt: new Date(),
      });
      user.activeTeam = { id: team.id, name: team.name, status: team.status };
      return team;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.teamMembership.updateMany({
        where: { userId, status: TeamMembershipStatus.ACTIVE },
        data: {
          status: TeamMembershipStatus.ENDED,
          endedAt: new Date(),
          endedByUserId: this.normalizeUuid(actorUserId),
        },
      });
      await tx.teamMembership.create({
        data: {
          userId,
          teamId,
          membershipType,
          assignedByUserId: this.normalizeUuid(actorUserId),
        },
      });
    });

    return (await this.findTeam(teamId))!;
  }

  async saveAudit(
    record: Omit<SecurityAuditRecord, "id" | "createdAt">,
  ): Promise<SecurityAuditRecord> {
    if (!this.prisma) {
      const audit = { ...record, id: this.nextId(), createdAt: new Date() };
      this.audits.push(audit);
      return audit;
    }
    const saved = await this.prisma.securityAuditRecord.create({
      data: {
        eventType: record.eventType,
        outcome: record.outcome as SecurityAuditOutcome,
        actorUserId: record.actorUserId,
        targetUserId: record.targetUserId,
        sessionId: record.sessionId,
        resource: record.resource,
        correlationId: record.correlationId,
        metadata: record.metadata as Prisma.InputJsonValue,
      },
    });
    return {
      id: saved.id,
      eventType: saved.eventType,
      actorUserId: saved.actorUserId ?? undefined,
      targetUserId: saved.targetUserId ?? undefined,
      sessionId: saved.sessionId ?? undefined,
      resource: saved.resource ?? undefined,
      outcome: saved.outcome,
      correlationId: saved.correlationId,
      metadata: saved.metadata as Record<string, unknown>,
      createdAt: saved.createdAt,
    };
  }

  async searchAudits(query: {
    actorUserId?: string;
    targetUserId?: string;
    eventType?: string;
    outcome?: string;
    from?: string;
    to?: string;
  }): Promise<SecurityAuditRecord[]> {
    if (!this.prisma) {
      let records = [...this.audits];
      if (query.actorUserId)
        records = records.filter((record) => record.actorUserId === query.actorUserId);
      if (query.targetUserId)
        records = records.filter((record) => record.targetUserId === query.targetUserId);
      if (query.eventType)
        records = records.filter((record) => record.eventType === query.eventType);
      if (query.outcome) records = records.filter((record) => record.outcome === query.outcome);
      if (query.from)
        records = records.filter((record) => record.createdAt >= new Date(query.from!));
      if (query.to) records = records.filter((record) => record.createdAt <= new Date(query.to!));
      return records;
    }

    const records = await this.prisma.securityAuditRecord.findMany({
      where: {
        actorUserId: query.actorUserId,
        targetUserId: query.targetUserId,
        eventType: query.eventType,
        outcome: query.outcome as SecurityAuditOutcome | undefined,
        createdAt: {
          gte: query.from ? new Date(query.from) : undefined,
          lte: query.to ? new Date(query.to) : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      id: record.id,
      eventType: record.eventType,
      actorUserId: record.actorUserId ?? undefined,
      targetUserId: record.targetUserId ?? undefined,
      sessionId: record.sessionId ?? undefined,
      resource: record.resource ?? undefined,
      outcome: record.outcome,
      correlationId: record.correlationId,
      metadata: record.metadata as Record<string, unknown>,
      createdAt: record.createdAt,
    }));
  }

  async saveAccessDecision(record: AccessDecisionRecord): Promise<AccessDecisionRecord> {
    if (!this.prisma) {
      this.accessDecisions.push(record);
      return record;
    }
    await this.prisma.accessDecision.create({
      data: {
        userId: record.userId,
        permissionCode: record.permissionCode,
        resource: record.resource,
        action: record.action,
        decision: record.decision,
        reason: record.reason,
        correlationId: record.correlationId,
        decidedAt: record.decidedAt,
      },
    });
    return record;
  }

  private async syncRoles(userId: string, roles: BusinessRoleCode[]): Promise<void> {
    if (!this.prisma) return;
    const desired = new Set(roles);
    const active = await this.prisma.roleAssignment.findMany({
      where: { userId, status: AssignmentStatus.ACTIVE },
    });
    for (const assignment of active) {
      if (!desired.has(assignment.roleCode as BusinessRoleCode)) {
        await this.prisma.roleAssignment.update({
          where: { id: assignment.id },
          data: { status: AssignmentStatus.REMOVED, removedAt: new Date() },
        });
      }
    }
    for (const role of desired) {
      if (
        !active.some(
          (assignment) =>
            assignment.roleCode === role && assignment.status === AssignmentStatus.ACTIVE,
        )
      ) {
        await this.prisma.roleAssignment.create({
          data: { userId, roleCode: role as PrismaBusinessRoleCode },
        });
      }
    }
  }

  private async syncReviewerAccess(userId: string, enabled: boolean): Promise<void> {
    if (!this.prisma) return;
    const active = await this.prisma.reviewerAssignment.findFirst({
      where: { userId, status: AssignmentStatus.ACTIVE },
    });
    if (enabled && !active) {
      await this.prisma.reviewerAssignment.create({ data: { userId } });
    }
    if (!enabled && active) {
      await this.prisma.reviewerAssignment.update({
        where: { id: active.id },
        data: { status: AssignmentStatus.REMOVED, removedAt: new Date() },
      });
    }
  }

  private userInclude() {
    return {
      roleAssignments: true,
      reviewerAssignments: true,
      teamMemberships: { include: { team: true } },
    } satisfies Prisma.PlatformUserInclude;
  }

  private teamInclude() {
    return {
      memberships: { include: { user: true } },
    } satisfies Prisma.TeamInclude;
  }

  private mapUser(user: UserWithRelations): PlatformUserRecord {
    const activeMembership = user.teamMemberships.find(
      (membership) => membership.status === TeamMembershipStatus.ACTIVE,
    );
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash ?? undefined,
      status: user.status,
      roles: user.roleAssignments
        .filter((assignment) => assignment.status === AssignmentStatus.ACTIVE)
        .map((assignment) => assignment.roleCode as BusinessRoleCode),
      hasReviewerAccess: user.reviewerAssignments.some(
        (assignment) => assignment.status === AssignmentStatus.ACTIVE,
      ),
      activeTeam: activeMembership
        ? {
            id: activeMembership.team.id,
            name: activeMembership.team.name,
            status: activeMembership.team.status,
          }
        : undefined,
      activatedAt: user.activatedAt ?? undefined,
      disabledAt: user.disabledAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapTeam(team: TeamWithMembers): TeamRecord {
    return {
      id: team.id,
      name: team.name,
      status: team.status,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      deactivatedAt: team.deactivatedAt ?? undefined,
      members: team.memberships.map((membership) => ({
        userId: membership.userId,
        displayName: membership.user.displayName,
        membershipType: membership.membershipType,
        status: membership.status,
        assignedAt: membership.assignedAt,
        endedAt: membership.endedAt ?? undefined,
      })),
    };
  }

  private normalizeUuid(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      ? value
      : undefined;
  }
}
