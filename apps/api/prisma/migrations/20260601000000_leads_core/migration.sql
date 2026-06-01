-- CreateEnum
CREATE TYPE "LeadSourceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "LeadStatusChangeType" AS ENUM ('NORMAL_FLOW', 'CORRECTION', 'ARCHIVE', 'RESTORE');

-- CreateEnum
CREATE TYPE "LeadHistoryEntryType" AS ENUM ('CREATED', 'CONTACT_UPDATED', 'ASSIGNED', 'STATUS_CHANGED', 'STATUS_CORRECTED', 'ARCHIVED', 'RESTORED', 'SOURCE_CHANGED', 'EXHIBITION_REFERENCE_CHANGED', 'NOTE_ADDED', 'DUPLICATE_BLOCKED', 'STALE_UPDATE_REJECTED');

-- CreateEnum
CREATE TYPE "LeadAction" AS ENUM ('CREATE', 'VIEW', 'UPDATE', 'ASSIGN', 'CHANGE_STATUS', 'ADD_NOTE', 'VIEW_HISTORY', 'SEARCH');

-- CreateEnum
CREATE TYPE "LeadAccessScope" AS ENUM ('GLOBAL', 'TEAM', 'OWNED', 'EXPLICIT', 'NONE');

-- CreateEnum
CREATE TYPE "LeadDomainEventName" AS ENUM ('LeadCreated', 'LeadAssigned', 'LeadStatusChanged', 'LeadSourceChanged', 'LeadExhibitionReferenceChanged', 'LeadNoteAdded');

-- CreateTable
CREATE TABLE "LeadSource" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "LeadSourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "LeadSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "displayName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "normalizedEmail" TEXT,
    "phone" TEXT,
    "normalizedPhone" TEXT,
    "sourceCode" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL,
    "budgetAmount" DECIMAL(14,2),
    "budgetCurrency" TEXT,
    "ownerUserId" UUID NOT NULL,
    "teamId" UUID,
    "createdByUserId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "archivedAt" TIMESTAMP(6),
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadExhibitionReference" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE,
    "location" TEXT,
    "createdByUserId" UUID,
    "updatedByUserId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "LeadExhibitionReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "fromUserId" UUID,
    "toUserId" UUID NOT NULL,
    "fromTeamId" UUID,
    "toTeamId" UUID,
    "assignedByUserId" UUID NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,
    CONSTRAINT "LeadAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadStatusHistory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "fromStatus" "LeadStatus",
    "toStatus" "LeadStatus" NOT NULL,
    "changedByUserId" UUID NOT NULL,
    "changeType" "LeadStatusChangeType" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,
    CONSTRAINT "LeadStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "authorUserId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,
    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadHistoryEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "entryType" "LeadHistoryEntryType" NOT NULL,
    "actorUserId" UUID,
    "summary" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,
    CONSTRAINT "LeadHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAccessDecision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "leadId" UUID,
    "action" "LeadAction" NOT NULL,
    "decision" "AccessDecisionValue" NOT NULL,
    "reason" TEXT NOT NULL,
    "scope" "LeadAccessScope" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,
    CONSTRAINT "LeadAccessDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadDomainEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" "LeadDomainEventName" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "leadId" UUID NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "idempotencyKey" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "status" "OperationalEventStatus" NOT NULL DEFAULT 'RECORDED',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMP(6),
    CONSTRAINT "LeadDomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadSource_code_key" ON "LeadSource"("code");
CREATE INDEX "LeadSource_status_idx" ON "LeadSource"("status");
CREATE UNIQUE INDEX "Lead_normalizedEmail_active_key" ON "Lead"("normalizedEmail") WHERE "archivedAt" IS NULL AND "normalizedEmail" IS NOT NULL;
CREATE UNIQUE INDEX "Lead_normalizedPhone_active_key" ON "Lead"("normalizedPhone") WHERE "archivedAt" IS NULL AND "normalizedPhone" IS NOT NULL;
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_sourceCode_idx" ON "Lead"("sourceCode");
CREATE INDEX "Lead_priority_idx" ON "Lead"("priority");
CREATE INDEX "Lead_ownerUserId_idx" ON "Lead"("ownerUserId");
CREATE INDEX "Lead_teamId_idx" ON "Lead"("teamId");
CREATE INDEX "Lead_createdByUserId_idx" ON "Lead"("createdByUserId");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Lead_updatedAt_idx" ON "Lead"("updatedAt");
CREATE INDEX "Lead_displayName_idx" ON "Lead"("displayName");
CREATE INDEX "Lead_company_idx" ON "Lead"("company");
CREATE INDEX "Lead_normalizedEmail_idx" ON "Lead"("normalizedEmail");
CREATE INDEX "Lead_normalizedPhone_idx" ON "Lead"("normalizedPhone");
CREATE INDEX "Lead_version_idx" ON "Lead"("version");
CREATE UNIQUE INDEX "LeadExhibitionReference_leadId_key" ON "LeadExhibitionReference"("leadId");
CREATE INDEX "LeadExhibitionReference_name_idx" ON "LeadExhibitionReference"("name");
CREATE INDEX "LeadExhibitionReference_date_idx" ON "LeadExhibitionReference"("date");
CREATE INDEX "LeadAssignment_leadId_idx" ON "LeadAssignment"("leadId");
CREATE INDEX "LeadAssignment_toUserId_idx" ON "LeadAssignment"("toUserId");
CREATE INDEX "LeadAssignment_toTeamId_idx" ON "LeadAssignment"("toTeamId");
CREATE INDEX "LeadAssignment_createdAt_idx" ON "LeadAssignment"("createdAt");
CREATE INDEX "LeadAssignment_correlationId_idx" ON "LeadAssignment"("correlationId");
CREATE INDEX "LeadStatusHistory_leadId_idx" ON "LeadStatusHistory"("leadId");
CREATE INDEX "LeadStatusHistory_toStatus_idx" ON "LeadStatusHistory"("toStatus");
CREATE INDEX "LeadStatusHistory_createdAt_idx" ON "LeadStatusHistory"("createdAt");
CREATE INDEX "LeadStatusHistory_correlationId_idx" ON "LeadStatusHistory"("correlationId");
CREATE INDEX "LeadNote_leadId_idx" ON "LeadNote"("leadId");
CREATE INDEX "LeadNote_authorUserId_idx" ON "LeadNote"("authorUserId");
CREATE INDEX "LeadNote_createdAt_idx" ON "LeadNote"("createdAt");
CREATE INDEX "LeadNote_correlationId_idx" ON "LeadNote"("correlationId");
CREATE INDEX "LeadHistoryEntry_leadId_idx" ON "LeadHistoryEntry"("leadId");
CREATE INDEX "LeadHistoryEntry_entryType_idx" ON "LeadHistoryEntry"("entryType");
CREATE INDEX "LeadHistoryEntry_actorUserId_idx" ON "LeadHistoryEntry"("actorUserId");
CREATE INDEX "LeadHistoryEntry_createdAt_idx" ON "LeadHistoryEntry"("createdAt");
CREATE INDEX "LeadHistoryEntry_correlationId_idx" ON "LeadHistoryEntry"("correlationId");
CREATE INDEX "LeadAccessDecision_userId_idx" ON "LeadAccessDecision"("userId");
CREATE INDEX "LeadAccessDecision_leadId_idx" ON "LeadAccessDecision"("leadId");
CREATE INDEX "LeadAccessDecision_action_idx" ON "LeadAccessDecision"("action");
CREATE INDEX "LeadAccessDecision_decision_idx" ON "LeadAccessDecision"("decision");
CREATE INDEX "LeadAccessDecision_createdAt_idx" ON "LeadAccessDecision"("createdAt");
CREATE INDEX "LeadAccessDecision_correlationId_idx" ON "LeadAccessDecision"("correlationId");
CREATE UNIQUE INDEX "LeadDomainEvent_idempotencyKey_key" ON "LeadDomainEvent"("idempotencyKey");
CREATE INDEX "LeadDomainEvent_leadId_idx" ON "LeadDomainEvent"("leadId");
CREATE INDEX "LeadDomainEvent_name_idx" ON "LeadDomainEvent"("name");
CREATE INDEX "LeadDomainEvent_status_idx" ON "LeadDomainEvent"("status");
CREATE INDEX "LeadDomainEvent_createdAt_idx" ON "LeadDomainEvent"("createdAt");
CREATE INDEX "LeadDomainEvent_correlationId_idx" ON "LeadDomainEvent"("correlationId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sourceCode_fkey" FOREIGN KEY ("sourceCode") REFERENCES "LeadSource"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LeadExhibitionReference" ADD CONSTRAINT "LeadExhibitionReference_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadAssignment" ADD CONSTRAINT "LeadAssignment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadStatusHistory" ADD CONSTRAINT "LeadStatusHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadHistoryEntry" ADD CONSTRAINT "LeadHistoryEntry_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadAccessDecision" ADD CONSTRAINT "LeadAccessDecision_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeadDomainEvent" ADD CONSTRAINT "LeadDomainEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
