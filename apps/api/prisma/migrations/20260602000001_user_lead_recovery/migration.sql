-- User and Lead Recovery lifecycle additions.
ALTER TABLE "PlatformUser"
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(6);

ALTER TYPE "AuthSessionRevocationReason" ADD VALUE IF NOT EXISTS 'USER_DELETED';

CREATE INDEX IF NOT EXISTS "PlatformUser_isDeleted_idx" ON "PlatformUser"("isDeleted");
CREATE INDEX IF NOT EXISTS "PlatformUser_status_isDeleted_idx" ON "PlatformUser"("status", "isDeleted");
CREATE INDEX IF NOT EXISTS "Lead_ownerUserId_createdAt_idx" ON "Lead"("ownerUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_teamId_createdAt_idx" ON "Lead"("teamId", "createdAt");
CREATE INDEX IF NOT EXISTS "Activity_ownerUserId_createdAt_idx" ON "Activity"("ownerUserId", "createdAt");
