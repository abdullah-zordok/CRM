-- CreateEnum
CREATE TYPE "ExhibitionStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttendeeStatus" AS ENUM ('PLANNED', 'CONFIRMED', 'ABSENT', 'REMOVED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "AttributionType" AS ENUM ('SOURCE', 'INFLUENCE', 'CORRECTION');

-- CreateEnum
CREATE TYPE "AttributionStatus" AS ENUM ('ACTIVE', 'REMOVED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "ExhibitionHistoryEntryType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'ARCHIVED', 'RESTORED', 'ATTENDEE_ASSIGNED', 'ATTENDANCE_CONFIRMED', 'ATTENDANCE_CORRECTED', 'LEAD_ATTRIBUTED', 'ATTRIBUTION_CORRECTED', 'ATTRIBUTION_REMOVED', 'STALE_UPDATE_REJECTED', 'ACCESS_DENIED');

-- CreateEnum
CREATE TYPE "ExhibitionAction" AS ENUM ('CREATE', 'VIEW', 'UPDATE', 'ARCHIVE', 'RESTORE', 'ASSIGN_ATTENDEE', 'CONFIRM_ATTENDANCE', 'ATTRIBUTE_LEAD', 'VIEW_SUMMARY', 'SEARCH');

-- CreateEnum
CREATE TYPE "ExhibitionAccessScope" AS ENUM ('GLOBAL', 'TEAM', 'ATTENDEE', 'OWNED_LEAD', 'EXPLICIT', 'NONE');

-- CreateEnum
CREATE TYPE "ExhibitionDomainEventName" AS ENUM ('ExhibitionCreated', 'ExhibitionUpdated', 'ExhibitionStatusChanged', 'ExhibitionAttendeeAssigned', 'ExhibitionAttendanceConfirmed', 'ExhibitionLeadAttributed', 'ExhibitionAttributionCorrected');

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(6) NOT NULL,
    "endsAt" TIMESTAMP(6) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "ExhibitionStatus" NOT NULL DEFAULT 'PLANNED',
    "ownerUserId" UUID NOT NULL,
    "teamId" UUID,
    "notes" TEXT,
    "archiveReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdByUserId" UUID NOT NULL,
    "updatedByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "archivedAt" TIMESTAMP(6),
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "Exhibition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionAttendee" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exhibitionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "teamId" UUID,
    "plannedRole" TEXT,
    "status" "AttendeeStatus" NOT NULL DEFAULT 'PLANNED',
    "confirmedAt" TIMESTAMP(6),
    "confirmedByUserId" UUID,
    "assignedByUserId" UUID NOT NULL,
    "removedByUserId" UUID,
    "correctionReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "ExhibitionAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionLeadAttribution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exhibitionId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "attributionType" "AttributionType" NOT NULL,
    "status" "AttributionStatus" NOT NULL DEFAULT 'ACTIVE',
    "sourceReferenceName" TEXT,
    "sourceReferenceDate" DATE,
    "sourceReferenceLocation" TEXT,
    "createdByUserId" UUID NOT NULL,
    "updatedByUserId" UUID,
    "correctionReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "ExhibitionLeadAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionHistoryEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exhibitionId" UUID NOT NULL,
    "entryType" "ExhibitionHistoryEntryType" NOT NULL,
    "actorUserId" UUID,
    "leadId" UUID,
    "attendeeUserId" UUID,
    "summary" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "ExhibitionHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionAccessDecision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "exhibitionId" UUID,
    "leadId" UUID,
    "action" "ExhibitionAction" NOT NULL,
    "decision" "AccessDecisionValue" NOT NULL,
    "reason" TEXT NOT NULL,
    "scope" "ExhibitionAccessScope" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "ExhibitionAccessDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionDomainEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" "ExhibitionDomainEventName" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "exhibitionId" UUID NOT NULL,
    "leadId" UUID,
    "attendeeUserId" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "idempotencyKey" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "status" "OperationalEventStatus" NOT NULL DEFAULT 'RECORDED',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMP(6),

    CONSTRAINT "ExhibitionDomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exhibition_status_idx" ON "Exhibition"("status");

-- CreateIndex
CREATE INDEX "Exhibition_teamId_idx" ON "Exhibition"("teamId");

-- CreateIndex
CREATE INDEX "Exhibition_ownerUserId_idx" ON "Exhibition"("ownerUserId");

-- CreateIndex
CREATE INDEX "Exhibition_startsAt_endsAt_idx" ON "Exhibition"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Exhibition_version_idx" ON "Exhibition"("version");

-- CreateIndex
CREATE INDEX "Exhibition_correlationId_idx" ON "Exhibition"("correlationId");

-- CreateIndex
CREATE INDEX "ExhibitionAttendee_exhibitionId_status_createdAt_idx" ON "ExhibitionAttendee"("exhibitionId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ExhibitionAttendee_userId_status_idx" ON "ExhibitionAttendee"("userId", "status");

-- CreateIndex
CREATE INDEX "ExhibitionAttendee_teamId_idx" ON "ExhibitionAttendee"("teamId");

-- CreateIndex
CREATE INDEX "ExhibitionAttendee_correlationId_idx" ON "ExhibitionAttendee"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitionAttendee_exhibitionId_userId_key" ON "ExhibitionAttendee"("exhibitionId", "userId");

-- CreateIndex
CREATE INDEX "ExhibitionLeadAttribution_exhibitionId_leadId_status_create_idx" ON "ExhibitionLeadAttribution"("exhibitionId", "leadId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ExhibitionLeadAttribution_leadId_idx" ON "ExhibitionLeadAttribution"("leadId");

-- CreateIndex
CREATE INDEX "ExhibitionLeadAttribution_correlationId_idx" ON "ExhibitionLeadAttribution"("correlationId");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_exhibitionId_idx" ON "ExhibitionHistoryEntry"("exhibitionId");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_entryType_idx" ON "ExhibitionHistoryEntry"("entryType");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_actorUserId_idx" ON "ExhibitionHistoryEntry"("actorUserId");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_leadId_idx" ON "ExhibitionHistoryEntry"("leadId");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_attendeeUserId_idx" ON "ExhibitionHistoryEntry"("attendeeUserId");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_createdAt_idx" ON "ExhibitionHistoryEntry"("createdAt");

-- CreateIndex
CREATE INDEX "ExhibitionHistoryEntry_correlationId_idx" ON "ExhibitionHistoryEntry"("correlationId");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_userId_idx" ON "ExhibitionAccessDecision"("userId");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_exhibitionId_idx" ON "ExhibitionAccessDecision"("exhibitionId");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_leadId_idx" ON "ExhibitionAccessDecision"("leadId");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_action_idx" ON "ExhibitionAccessDecision"("action");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_decision_idx" ON "ExhibitionAccessDecision"("decision");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_createdAt_idx" ON "ExhibitionAccessDecision"("createdAt");

-- CreateIndex
CREATE INDEX "ExhibitionAccessDecision_correlationId_idx" ON "ExhibitionAccessDecision"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitionDomainEvent_idempotencyKey_key" ON "ExhibitionDomainEvent"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_exhibitionId_idx" ON "ExhibitionDomainEvent"("exhibitionId");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_leadId_idx" ON "ExhibitionDomainEvent"("leadId");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_attendeeUserId_idx" ON "ExhibitionDomainEvent"("attendeeUserId");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_name_idx" ON "ExhibitionDomainEvent"("name");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_status_idx" ON "ExhibitionDomainEvent"("status");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_createdAt_idx" ON "ExhibitionDomainEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ExhibitionDomainEvent_correlationId_idx" ON "ExhibitionDomainEvent"("correlationId");

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAttendee" ADD CONSTRAINT "ExhibitionAttendee_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAttendee" ADD CONSTRAINT "ExhibitionAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAttendee" ADD CONSTRAINT "ExhibitionAttendee_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAttendee" ADD CONSTRAINT "ExhibitionAttendee_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionLeadAttribution" ADD CONSTRAINT "ExhibitionLeadAttribution_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionLeadAttribution" ADD CONSTRAINT "ExhibitionLeadAttribution_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionLeadAttribution" ADD CONSTRAINT "ExhibitionLeadAttribution_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionLeadAttribution" ADD CONSTRAINT "ExhibitionLeadAttribution_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionHistoryEntry" ADD CONSTRAINT "ExhibitionHistoryEntry_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionHistoryEntry" ADD CONSTRAINT "ExhibitionHistoryEntry_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAccessDecision" ADD CONSTRAINT "ExhibitionAccessDecision_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionAccessDecision" ADD CONSTRAINT "ExhibitionAccessDecision_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionDomainEvent" ADD CONSTRAINT "ExhibitionDomainEvent_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
