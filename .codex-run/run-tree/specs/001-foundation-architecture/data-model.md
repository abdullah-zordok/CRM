# Data Model: Foundation Architecture

## Overview

Phase 0 persists only the data required to prove secure access, auditability,
event readiness, queue readiness, and operational verification. It does not
create live CRM business records such as leads, deals, activities, revenue,
targets, exhibitions, notifications, WhatsApp conversations, or AI insights.

## Entities

### FoundationUser

Minimal identity used to validate login and protected shell access.

**Fields**:
- `id`: Stable unique identifier.
- `email`: Unique login email, normalized to lowercase.
- `displayName`: Human-readable name for the seeded Admin user.
- `passwordHash`: One-way password hash for Phase 0 local authentication.
- `status`: `ACTIVE` or `DISABLED`.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Has many `FoundationUserRole` records.
- Has many `AuthSession` records.
- May appear as actor on `SecurityAuditRecord`.

**Validation rules**:
- Email is required, unique, normalized, and valid email format.
- Password hash is required; raw passwords are never persisted.
- Only the seeded Admin user is required in Phase 0.

### RoleCategory

Baseline RBAC category for future permission rules.

**Fields**:
- `id`: Stable unique identifier.
- `code`: Unique enum-like value: `ADMIN`, `MANAGER`, `SALES_REPRESENTATIVE`.
- `name`: Display label.
- `description`: Short operational description.
- `createdAt`: Creation timestamp.

**Relationships**:
- Has many `FoundationUserRole` records.

**Validation rules**:
- Codes are fixed in Phase 0.
- Role category creation outside seed data is out of scope.

### FoundationUserRole

Assignment between a foundation user and a role category.

**Fields**:
- `userId`: References `FoundationUser`.
- `roleId`: References `RoleCategory`.
- `assignedAt`: Assignment timestamp.

**Relationships**:
- Belongs to one `FoundationUser`.
- Belongs to one `RoleCategory`.

**Validation rules**:
- Duplicate user-role pairs are not allowed.
- The seeded Admin user must have the `ADMIN` role.

### AuthSession

Minimum persisted or verifiable authentication state for login/logout.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `FoundationUser`.
- `sessionHash`: Hash of session token or JWT identifier.
- `status`: `ACTIVE`, `REVOKED`, or `EXPIRED`.
- `issuedAt`: Session creation timestamp.
- `expiresAt`: Session expiration timestamp.
- `revokedAt`: Logout/revocation timestamp, nullable.
- `lastSeenAt`: Last authenticated request timestamp, nullable.

**Relationships**:
- Belongs to one `FoundationUser`.
- May be referenced by `SecurityAuditRecord`.

**Validation rules**:
- Raw session tokens are never persisted.
- Active sessions require future `expiresAt`.
- Logout changes `status` to `REVOKED`.

**State transitions**:
- `ACTIVE` -> `REVOKED` on logout.
- `ACTIVE` -> `EXPIRED` when past expiration.

### AccessDecision

Recorded result of evaluating access to a protected foundation area.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `FoundationUser`, nullable for anonymous requests.
- `resource`: Protected area or operation name.
- `action`: Requested action.
- `decision`: `ALLOW` or `DENY`.
- `reason`: Machine-readable reason such as `ANONYMOUS`, `ROLE_ALLOWED`, or
  `ROLE_DENIED`.
- `correlationId`: Request correlation identifier.
- `decidedAt`: Decision timestamp.

**Relationships**:
- May produce one `SecurityAuditRecord`.

**Validation rules**:
- Denied anonymous access must be recorded for protected shell attempts.
- Every decision must include a correlation identifier.

### SecurityAuditRecord

Traceable record of security-sensitive foundation behavior.

**Fields**:
- `id`: Stable unique identifier.
- `eventType`: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `ACCESS_DENIED`,
  `ACCESS_ALLOWED`, `CONFIG_ERROR`, or `SYSTEM_STARTUP`.
- `actorUserId`: References `FoundationUser`, nullable for anonymous/system
  events.
- `sessionId`: References `AuthSession`, nullable.
- `resource`: Affected foundation resource, nullable.
- `outcome`: `SUCCESS`, `FAILURE`, or `DENIED`.
- `ipAddress`: Request IP if available.
- `userAgent`: Request user agent if available.
- `correlationId`: Request correlation identifier.
- `metadata`: Sanitized JSON metadata with no secrets or raw tokens.
- `createdAt`: Audit timestamp.

**Relationships**:
- May reference `FoundationUser` and `AuthSession`.

**Validation rules**:
- Secrets, raw passwords, raw tokens, and stack traces are forbidden in metadata.
- Login, logout, and denied access must produce audit records.
- Audit records are append-only in Phase 0.

### OperationalEvent

Named signal used to validate internal event architecture.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Event name; Phase 0 includes `FoundationSmokeRequested`.
- `version`: Event contract version.
- `payload`: Sanitized JSON payload.
- `correlationId`: Request or job correlation identifier.
- `status`: `RECORDED`, `DISPATCHED`, `HANDLED`, or `FAILED`.
- `createdAt`: Event creation timestamp.
- `handledAt`: Handler completion timestamp, nullable.

**Relationships**:
- May create one `BackgroundJob`.
- May be referenced by `SecurityAuditRecord` or logs through `correlationId`.

**Validation rules**:
- Phase 0 events cannot contain CRM business data.
- Event name and version are required.

**State transitions**:
- `RECORDED` -> `DISPATCHED` -> `HANDLED`.
- `RECORDED` or `DISPATCHED` -> `FAILED` on unrecoverable failure.

### BackgroundJob

Queue job used to validate background processing and retry behavior.

**Fields**:
- `id`: Stable unique identifier.
- `queueName`: Queue name.
- `jobType`: `FOUNDATION_SMOKE_JOB` in Phase 0.
- `status`: `QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, or `RETRYING`.
- `attempts`: Number of attempts made.
- `maxAttempts`: Maximum attempts allowed.
- `idempotencyKey`: Unique key preventing duplicate smoke job effects.
- `correlationId`: Request or event correlation identifier.
- `lastError`: Sanitized last error message, nullable.
- `createdAt`: Creation timestamp.
- `startedAt`: First start timestamp, nullable.
- `completedAt`: Completion timestamp, nullable.

**Relationships**:
- May be created from one `OperationalEvent`.

**Validation rules**:
- Job payload must not include CRM business data.
- Retry policy and idempotency key are required.
- Errors must be sanitized.

**State transitions**:
- `QUEUED` -> `RUNNING` -> `COMPLETED`.
- `RUNNING` -> `RETRYING` -> `RUNNING`.
- `RUNNING` or `RETRYING` -> `FAILED` after max attempts.

### HealthCheckResult

Read-only status projection for foundation availability.

**Fields**:
- `service`: `api`, `web`, `database`, `cache`, or `queue`.
- `status`: `UP`, `DEGRADED`, or `DOWN`.
- `checkedAt`: Check timestamp.
- `details`: Sanitized status details.

**Validation rules**:
- Health details must not expose secrets or raw connection strings.
- Readiness must report dependent service status.

### QualityPipelineRun

Verification record for every change in CI or local equivalent.

**Fields**:
- `id`: Stable unique identifier.
- `trigger`: `LOCAL` or `CI`.
- `commitSha`: Commit identifier if available.
- `status`: `PASSED`, `FAILED`, or `CANCELLED`.
- `checks`: Build, tests, security checks, migrations, and container startup.
- `startedAt`: Run start timestamp.
- `completedAt`: Run completion timestamp, nullable.

**Validation rules**:
- Acceptance requires passing build, tests, security checks, migrations, and
  container startup.
- Production deployment approval is out of scope.

## Data Retention

- Foundation users and role categories are retained until replaced by Phase 1
  user management.
- Auth sessions expire according to configured session lifetime and may be
  purged after audit needs are met.
- Security audit records are append-only in Phase 0.
- Smoke event and job records may be retained for troubleshooting during
  development and CI validation.

## Indexing And Uniqueness

- Unique index on `FoundationUser.email`.
- Unique index on `RoleCategory.code`.
- Unique composite index on `FoundationUserRole.userId` + `roleId`.
- Index `SecurityAuditRecord.correlationId` and `createdAt`.
- Index `OperationalEvent.correlationId` and `status`.
- Unique index on `BackgroundJob.idempotencyKey`.
- Index `BackgroundJob.status` and `correlationId`.
