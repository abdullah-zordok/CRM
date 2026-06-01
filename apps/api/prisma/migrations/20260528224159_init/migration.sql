CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "PlatformUserStatus" AS ENUM ('PENDING_ACTIVATION', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "BusinessRoleCode" AS ENUM ('ADMIN', 'MANAGER', 'SALES_REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "GranteeType" AS ENUM ('BUSINESS_ROLE', 'ACCESS_PROFILE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TeamMembershipType" AS ENUM ('MEMBER', 'MANAGER');

-- CreateEnum
CREATE TYPE "TeamMembershipStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ActivationTokenStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuthSessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuthSessionRevocationReason" AS ENUM ('LOGOUT', 'USER_DISABLED', 'ROLE_REMOVED', 'REVIEWER_ACCESS_REMOVED', 'SECURITY_REVOKE');

-- CreateEnum
CREATE TYPE "AccessDecisionValue" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "SecurityAuditOutcome" AS ENUM ('SUCCESS', 'FAILURE', 'DENIED');

-- CreateEnum
CREATE TYPE "OperationalEventStatus" AS ENUM ('RECORDED', 'DISPATCHED', 'HANDLED', 'FAILED');

-- CreateEnum
CREATE TYPE "BackgroundJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING');

-- CreateTable
CREATE TABLE "PlatformUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "status" "PlatformUserStatus" NOT NULL DEFAULT 'PENDING_ACTIVATION',
    "activatedAt" TIMESTAMP(6),
    "disabledAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "PlatformUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessRole" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" "BusinessRoleCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isSystemManaged" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BusinessRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionGrant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "granteeType" "GranteeType" NOT NULL,
    "granteeCode" TEXT NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PermissionGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "roleCode" "BusinessRoleCode" NOT NULL,
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedByUserId" UUID,
    "removedAt" TIMESTAMP(6),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "RoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewerAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedByUserId" UUID,
    "removedAt" TIMESTAMP(6),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "ReviewerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "status" "TeamStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "deactivatedAt" TIMESTAMP(6),
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembership" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "membershipType" "TeamMembershipType" NOT NULL,
    "status" "TeamMembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedByUserId" UUID,
    "endedAt" TIMESTAMP(6),
    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "ActivationTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "usedAt" TIMESTAMP(6),
    "revokedAt" TIMESTAMP(6),
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "status" "AuthSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "revokedAt" TIMESTAMP(6),
    "revocationReason" "AuthSessionRevocationReason",
    "lastSeenAt" TIMESTAMP(6),
    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessDecision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "permissionCode" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "decision" "AccessDecisionValue" NOT NULL,
    "reason" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "decidedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityAuditRecord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventType" TEXT NOT NULL,
    "actorUserId" UUID,
    "targetUserId" UUID,
    "sessionId" UUID,
    "resource" TEXT,
    "outcome" "SecurityAuditOutcome" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "correlationId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SecurityAuditRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "idempotencyKey" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "status" "OperationalEventStatus" NOT NULL DEFAULT 'RECORDED',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMP(6),
    CONSTRAINT "OperationalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundJob" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "operationalEventId" UUID,
    "queueName" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" "BackgroundJobStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(6),
    "completedAt" TIMESTAMP(6),
    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_email_key" ON "PlatformUser"("email");
CREATE INDEX "PlatformUser_status_idx" ON "PlatformUser"("status");
CREATE INDEX "PlatformUser_displayName_idx" ON "PlatformUser"("displayName");
CREATE INDEX "PlatformUser_email_idx" ON "PlatformUser"("email");
CREATE UNIQUE INDEX "BusinessRole_code_key" ON "BusinessRole"("code");
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");
CREATE INDEX "PermissionGrant_granteeCode_idx" ON "PermissionGrant"("granteeCode");
CREATE UNIQUE INDEX "PermissionGrant_granteeType_granteeCode_permissionCode_key" ON "PermissionGrant"("granteeType", "granteeCode", "permissionCode");
CREATE INDEX "RoleAssignment_userId_status_idx" ON "RoleAssignment"("userId", "status");
CREATE INDEX "RoleAssignment_roleCode_status_idx" ON "RoleAssignment"("roleCode", "status");
CREATE INDEX "ReviewerAssignment_userId_status_idx" ON "ReviewerAssignment"("userId", "status");
CREATE INDEX "Team_name_idx" ON "Team"("name");
CREATE INDEX "Team_status_idx" ON "Team"("status");
CREATE INDEX "TeamMembership_teamId_status_idx" ON "TeamMembership"("teamId", "status");
CREATE INDEX "TeamMembership_userId_status_idx" ON "TeamMembership"("userId", "status");
CREATE UNIQUE INDEX "ActivationToken_tokenHash_key" ON "ActivationToken"("tokenHash");
CREATE INDEX "ActivationToken_userId_status_idx" ON "ActivationToken"("userId", "status");
CREATE INDEX "ActivationToken_expiresAt_idx" ON "ActivationToken"("expiresAt");
CREATE UNIQUE INDEX "AuthSession_sessionHash_key" ON "AuthSession"("sessionHash");
CREATE INDEX "AuthSession_userId_status_idx" ON "AuthSession"("userId", "status");
CREATE INDEX "AccessDecision_correlationId_idx" ON "AccessDecision"("correlationId");
CREATE INDEX "AccessDecision_permissionCode_decision_idx" ON "AccessDecision"("permissionCode", "decision");
CREATE INDEX "SecurityAuditRecord_actorUserId_idx" ON "SecurityAuditRecord"("actorUserId");
CREATE INDEX "SecurityAuditRecord_targetUserId_idx" ON "SecurityAuditRecord"("targetUserId");
CREATE INDEX "SecurityAuditRecord_eventType_outcome_createdAt_idx" ON "SecurityAuditRecord"("eventType", "outcome", "createdAt");
CREATE INDEX "SecurityAuditRecord_correlationId_idx" ON "SecurityAuditRecord"("correlationId");
CREATE UNIQUE INDEX "OperationalEvent_idempotencyKey_key" ON "OperationalEvent"("idempotencyKey");
CREATE INDEX "OperationalEvent_correlationId_idx" ON "OperationalEvent"("correlationId");
CREATE INDEX "OperationalEvent_status_idx" ON "OperationalEvent"("status");
CREATE UNIQUE INDEX "BackgroundJob_idempotencyKey_key" ON "BackgroundJob"("idempotencyKey");
CREATE INDEX "BackgroundJob_status_idx" ON "BackgroundJob"("status");
CREATE INDEX "BackgroundJob_correlationId_idx" ON "BackgroundJob"("correlationId");

-- AddForeignKey
ALTER TABLE "PermissionGrant" ADD CONSTRAINT "PermissionGrant_permissionCode_fkey" FOREIGN KEY ("permissionCode") REFERENCES "Permission"("code") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_roleCode_fkey" FOREIGN KEY ("roleCode") REFERENCES "BusinessRole"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewerAssignment" ADD CONSTRAINT "ReviewerAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivationToken" ADD CONSTRAINT "ActivationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_operationalEventId_fkey" FOREIGN KEY ("operationalEventId") REFERENCES "OperationalEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
