import type { PlatformUserRecord, SecurityAuditRecord, TeamRecord } from "./users.types.js";

export function toUserSummary(user: PlatformUserRecord, correlationId = "local") {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    status: user.status,
    isDeleted: user.isDeleted ?? false,
    roles: user.roles,
    hasReviewerAccess: user.hasReviewerAccess,
    activeTeam: user.activeTeam,
    correlationId,
  };
}

export function toUserDetail(user: PlatformUserRecord, correlationId = "local") {
  return {
    ...toUserSummary(user, correlationId),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toTeamDto(team: TeamRecord, correlationId = "local") {
  return {
    id: team.id,
    name: team.name,
    status: team.status,
    members: team.members.map((member) => ({
      userId: member.userId,
      displayName: member.displayName,
      membershipType: member.membershipType,
    })),
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    correlationId,
  };
}

const sensitiveKeys = new Set([
  "password",
  "token",
  "activationToken",
  "sessionHash",
  "tokenHash",
  "secret",
]);

export function redactMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      sensitiveKeys.has(key) || key.toLowerCase().includes("token") ? "[REDACTED]" : value,
    ]),
  );
}

export function toAuditDto(record: SecurityAuditRecord) {
  return {
    ...record,
    metadata: redactMetadata(record.metadata),
    createdAt: record.createdAt.toISOString(),
  };
}
