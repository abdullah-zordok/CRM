import type { BusinessRoleCode } from "./permissions/permission-codes.js";

export type UserStatus = "PENDING_ACTIVATION" | "ACTIVE" | "DISABLED";
export type AssignmentStatus = "ACTIVE" | "REMOVED";
export type TeamStatus = "ACTIVE" | "INACTIVE";
export type TeamMembershipType = "MEMBER" | "MANAGER";
export type TeamMembershipStatus = "ACTIVE" | "ENDED";
export type ActivationStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";
export type SessionStatus = "ACTIVE" | "REVOKED" | "EXPIRED";
export type AuditOutcome = "SUCCESS" | "FAILURE" | "DENIED";

export interface PlatformUserRecord {
  id: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  status: UserStatus;
  roles: BusinessRoleCode[];
  hasReviewerAccess: boolean;
  activeTeam?: TeamSummary;
  activatedAt?: Date;
  disabledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivationRecord {
  id: string;
  userId: string;
  tokenHash: string;
  rawToken?: string;
  status: ActivationStatus;
  expiresAt: Date;
  usedAt?: Date;
  revokedAt?: Date;
  createdByUserId?: string;
  createdAt: Date;
}

export interface AuthSessionRecord {
  id: string;
  userId: string;
  sessionHash: string;
  status: SessionStatus;
  expiresAt: Date;
  revokedAt?: Date;
  revocationReason?: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  status: TeamStatus;
}

export interface TeamRecord extends TeamSummary {
  members: TeamMemberRecord[];
  createdAt: Date;
  updatedAt: Date;
  deactivatedAt?: Date;
}

export interface TeamMemberRecord {
  userId: string;
  displayName: string;
  membershipType: TeamMembershipType;
  status: TeamMembershipStatus;
  assignedAt: Date;
  endedAt?: Date;
}

export interface AccessDecisionRecord {
  userId?: string;
  permissionCode: string;
  resource: string;
  action: string;
  decision: "ALLOW" | "DENY";
  reason: string;
  correlationId: string;
  decidedAt: Date;
}

export interface SecurityAuditRecord {
  id: string;
  eventType: string;
  actorUserId?: string;
  targetUserId?: string;
  sessionId?: string;
  resource?: string;
  outcome: AuditOutcome;
  correlationId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
