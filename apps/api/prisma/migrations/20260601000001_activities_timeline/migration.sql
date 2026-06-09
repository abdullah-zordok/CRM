-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'EXHIBITION_VISIT', 'WHATSAPP', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ActivityOutcome" AS ENUM ('CONNECTED', 'NO_ANSWER', 'QUALIFIED_INTEREST', 'FOLLOW_UP_REQUIRED', 'NOT_INTERESTED', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityAuditType" AS ENUM ('ACTIVITY_CREATED', 'FOLLOW_UP_SCHEDULED', 'FOLLOW_UP_COMPLETED', 'FOLLOW_UP_REASSIGNED', 'ACTIVITY_CANCELED', 'ACTIVITY_CORRECTED', 'ACTIVITY_ACCESS_DENIED');

-- AlterEnum
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_CREATE';
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_VIEW';
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_COMPLETE';
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_REASSIGN';
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_CANCEL';
ALTER TYPE "LeadAction" ADD VALUE IF NOT EXISTS 'ACTIVITY_SEARCH';

-- AlterEnum
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'ActivityCreated';
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'FollowUpScheduled';
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'FollowUpCompleted';
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'FollowUpReassigned';
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'ActivityCanceled';
ALTER TYPE "LeadDomainEventName" ADD VALUE IF NOT EXISTS 'ActivityCorrected';

-- AlterEnum
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'ACTIVITY_CREATED';
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'FOLLOW_UP_SCHEDULED';
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'FOLLOW_UP_COMPLETED';
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'FOLLOW_UP_REASSIGNED';
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'ACTIVITY_CANCELED';
ALTER TYPE "LeadHistoryEntryType" ADD VALUE IF NOT EXISTS 'ACTIVITY_CORRECTED';

-- CreateTable
CREATE TABLE "Activity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'PLANNED',
    "ownerUserId" UUID NOT NULL,
    "teamId" UUID,
    "recordedByUserId" UUID NOT NULL,
    "activityAt" TIMESTAMP(6),
    "dueAt" TIMESTAMP(6),
    "completedAt" TIMESTAMP(6),
    "canceledAt" TIMESTAMP(6),
    "outcome" "ActivityOutcome",
    "note" TEXT,
    "cancellationReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "correlationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityAuditEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "activityId" UUID,
    "leadId" UUID,
    "actorUserId" UUID,
    "eventType" "ActivityAuditType" NOT NULL,
    "outcome" "SecurityAuditOutcome" NOT NULL DEFAULT 'SUCCESS',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "correlationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityAuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_leadId_activityAt_dueAt_createdAt_idx" ON "Activity"("leadId", "activityAt", "dueAt", "createdAt");
CREATE INDEX "Activity_ownerUserId_status_dueAt_idx" ON "Activity"("ownerUserId", "status", "dueAt");
CREATE INDEX "Activity_teamId_status_dueAt_idx" ON "Activity"("teamId", "status", "dueAt");
CREATE INDEX "Activity_type_status_createdAt_idx" ON "Activity"("type", "status", "createdAt");
CREATE INDEX "Activity_correlationId_idx" ON "Activity"("correlationId");
CREATE INDEX "Activity_version_idx" ON "Activity"("version");
CREATE INDEX "ActivityAuditEntry_activityId_createdAt_idx" ON "ActivityAuditEntry"("activityId", "createdAt");
CREATE INDEX "ActivityAuditEntry_leadId_createdAt_idx" ON "ActivityAuditEntry"("leadId", "createdAt");
CREATE INDEX "ActivityAuditEntry_actorUserId_idx" ON "ActivityAuditEntry"("actorUserId");
CREATE INDEX "ActivityAuditEntry_eventType_outcome_createdAt_idx" ON "ActivityAuditEntry"("eventType", "outcome", "createdAt");
CREATE INDEX "ActivityAuditEntry_correlationId_idx" ON "ActivityAuditEntry"("correlationId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActivityAuditEntry" ADD CONSTRAINT "ActivityAuditEntry_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
