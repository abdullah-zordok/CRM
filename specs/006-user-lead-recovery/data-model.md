# Data Model: User and Lead Recovery

## Overview

This feature updates existing user, authentication, lead, activity, follow-up, dashboard, audit, and domain event models so Admin-created users can sign in immediately, deleted users preserve historical accountability, Sales Representatives can create owned leads, and authorized users can review operational metrics.

## Entities

### PlatformUser

Managed CRM identity for a user.

**Fields**:
- `id`: Stable unique identifier.
- `email`: Unique normalized login email.
- `displayName`: Human-readable name.
- `status`: `ACTIVE` or `DISABLED` for new Admin-created users in this phase; historical `PENDING_ACTIVATION` may remain for existing records.
- `passwordHash`: Protected credential hash, nullable only for historical or migrated accounts that require remediation.
- `deletedAt`: Deletion timestamp, nullable.
- `isDeleted`: Whether the user is removed from active operations.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Has many role assignments.
- Has zero or one active team membership.
- Has many sessions.
- May own leads.
- May create leads, notes, activities, and follow-ups.
- May appear as actor or target on audit records and domain events.

**Validation rules**:
- Email is required, unique among non-deleted active-operation users, normalized, and valid.
- Display name is required.
- New Admin-created users require an initial password.
- Raw passwords are never persisted or returned.
- New Admin-created users start as `ACTIVE`.
- Disabled or deleted users cannot sign in.
- Self-disable and self-delete are blocked for the signed-in Admin.
- At least one active non-deleted Admin must remain.

**State transitions**:
- New user: created as `ACTIVE`.
- `ACTIVE` -> `DISABLED` when Admin disables access.
- `DISABLED` -> `ACTIVE` when Admin re-enables access.
- `ACTIVE` or `DISABLED` -> deleted state when Admin deletes the user.

### Credential

Protected sign-in secret associated with a PlatformUser.

**Fields**:
- `userId`: Associated user.
- `passwordHash`: Protected hash of the current password.
- `updatedAt`: Last credential update timestamp.

**Relationships**:
- Belongs to one PlatformUser.

**Validation rules**:
- Password must meet security policy.
- Raw password is accepted only during credential creation or update and discarded immediately after hashing.
- Credential values are redacted from responses, logs, audit metadata, and events.

### BusinessRole

Fixed CRM role used for access decisions.

**Fields**:
- `code`: `ADMIN`, `MANAGER`, or `SALES_REPRESENTATIVE`.
- `name`: Display label.

**Relationships**:
- Has many PlatformUsers through role assignments.
- Grants permissions through the fixed permission matrix.

**Validation rules**:
- Role codes remain fixed.
- Removing or deleting the last active Admin is blocked.

### Team

Sales operations group used for Manager scope.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Team name.
- `status`: Active or inactive.

**Relationships**:
- Has many team memberships.
- Scopes Manager access to users, leads, activities, follow-ups, and metrics.

**Validation rules**:
- Manager metric and lead views use active team responsibility.
- Managers with no team receive empty scoped results, not global data.

### AuthSession

Authenticated access state for a PlatformUser.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: Associated user.
- `status`: `ACTIVE`, `REVOKED`, or `EXPIRED`.
- `issuedAt`: Session creation timestamp.
- `expiresAt`: Session expiration timestamp.
- `revokedAt`: Revocation timestamp, nullable.
- `revocationReason`: Logout, disabled, deleted, role removed, or security revocation.

**Relationships**:
- Belongs to one PlatformUser.
- May be referenced by audit records and access decisions.

**Validation rules**:
- Disabled or deleted users cannot create new active sessions.
- Active sessions for deleted or disabled users are revoked.
- Session secrets are never stored raw or returned.

### Lead

Customer or prospect record.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Person or lead display name.
- `email`: Contact email, nullable when phone or another required identity field is present.
- `phone`: Contact phone, nullable when email or another required identity field is present.
- `company`: Company name, nullable.
- `ownerId`: PlatformUser responsible for the lead.
- `createdById`: PlatformUser who created the lead.
- `source`: Lead source.
- `status`: Lead status.
- `priority`: Lead priority.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Belongs to owner PlatformUser.
- Belongs to creator PlatformUser.
- Has many notes, activities, follow-ups, history entries, audit records, and domain events.

**Validation rules**:
- Sales Representative-created leads set `ownerId` and `createdById` to the signed-in representative.
- Lead creation must not search for another owner when the signed-in Sales Representative is eligible.
- Sales Representatives can view owned leads only.
- Managers can view leads owned by users in their team scope.
- Admins can view all leads.
- Owner and creator references remain readable to authorized users after a user is deleted.

### LeadNote

Append-only note associated with a lead.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: Associated lead.
- `authorUserId`: User who added the note.
- `body`: Note text.
- `createdAt`: Creation timestamp.

**Relationships**:
- Belongs to one Lead.
- Belongs to author PlatformUser.

**Validation rules**:
- Author must have access to the lead.
- Body is required and length-limited.
- Notes are append-only for normal workflows.
- Note bodies are validated to avoid storing credentials, private documents, payment data, or hidden audit metadata.

### FollowUp

Planned or completed next action for a lead.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: Associated lead.
- `assignedUserId`: User responsible for the follow-up.
- `createdById`: User who created the follow-up.
- `status`: Follow-up state.
- `dueAt`: Due timestamp, nullable.
- `completedAt`: Completion timestamp, nullable.
- `createdAt`: Creation timestamp.

**Relationships**:
- Belongs to one Lead.
- Belongs to assigned and creator PlatformUsers.
- Contributes to representative dashboard metrics.

**Validation rules**:
- User must have lead access to create or view follow-ups.
- Dashboard counts are scoped by Admin global access or Manager team access.

### Activity

Recorded sales action for a lead or representative.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: Associated lead, nullable if activity is user-level.
- `actorUserId`: User who performed the activity.
- `activityType`: Sales activity category.
- `occurredAt`: Business occurrence timestamp.
- `createdAt`: Creation timestamp.

**Relationships**:
- Belongs to a PlatformUser.
- May belong to a Lead.
- Contributes to representative dashboard metrics and last activity.

**Validation rules**:
- Visibility follows lead access or team/user scope.
- Deleted users remain available for historical display.

### OperationalDashboardMetric

Scoped summary of lead and representative performance.

**Fields**:
- `scope`: `ADMIN_GLOBAL` or `MANAGER_TEAM`.
- `totalLeads`: Count of visible leads.
- `leadsByRepresentative`: Count grouped by representative.
- `leadsByTeam`: Count grouped by team.
- `leadsBySource`: Count grouped by source.
- `representativeActivityCount`: Activity count by representative.
- `representativeFollowUpCount`: Follow-up count by representative.
- `representativeLastActivity`: Most recent activity timestamp by representative.
- `generatedAt`: Timestamp when metrics were calculated.

**Relationships**:
- Derived from PlatformUser, Team, Lead, Activity, and FollowUp records.

**Validation rules**:
- Admin scope includes all operational records.
- Manager scope includes only team records.
- Sales Representatives do not receive management dashboard metrics unless a separate permission grants them.
- Empty scopes return zero counts and empty groups.

### SecurityAuditRecord

Append-only record for security and accountability behavior.

**Fields**:
- `id`: Stable unique identifier.
- `eventType`: Event category.
- `actorUserId`: Acting user, nullable for anonymous login failure.
- `targetUserId`: Affected user, nullable.
- `leadId`: Affected lead, nullable.
- `outcome`: `SUCCESS`, `FAILURE`, or `DENIED`.
- `metadata`: Sanitized JSON metadata.
- `correlationId`: Request correlation identifier.
- `createdAt`: Audit timestamp.

**Relationships**:
- References users, leads, sessions, lifecycle changes, access decisions, or dashboard access through sanitized identifiers.

**Validation rules**:
- Audit records are append-only.
- Metadata never contains raw passwords, credential hashes, session secrets, stack traces, or restricted lead details.
- User creation, credential assignment, login success/denial, user update, disable, delete, deletion blocks, lead creation, ownership assignment, visibility denial, note/follow-up additions, and dashboard metric access create audit records.

### DomainEvent

Internal signal for business or security state changes.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Stable event name.
- `version`: Event contract version.
- `payload`: Sanitized JSON payload.
- `idempotencyKey`: Unique key for repeatable submissions.
- `correlationId`: Request correlation identifier.
- `status`: Recorded or dispatched state.
- `createdAt`: Creation timestamp.

**Relationships**:
- May correspond to one or more audit records.

**Validation rules**:
- Payloads are typed and sanitized.
- Events include correlation identifiers.
- No downstream notification or analytics queue job is required in this feature.

## Data Retention

- Users are retained after deletion as historical references with active access removed.
- Lead owner and creator references are retained indefinitely for accountability unless a later compliance process defines redaction.
- Notes, activities, follow-ups, security audit records, and domain events are append-only for this phase.
- Sessions for deleted or disabled users may be purged after expiration once audit needs are met.
- Credential hashes for deleted users should not permit sign-in and may be rotated or invalidated according to security policy while preserving the user reference.

## Indexing And Uniqueness

- Unique index on normalized active-operation user email.
- Index on user status, deleted state, and role assignment.
- Index on active Admin role assignments for last-admin checks.
- Index on team membership by user, team, membership status, and role.
- Index on session user and status.
- Index on lead owner, creator, source, status, priority, createdAt, updatedAt, and team-derived owner scope.
- Index on activities by actor user, lead, occurredAt, and createdAt.
- Index on follow-ups by assigned user, creator, lead, status, dueAt, and createdAt.
- Index on audit event type, actor, target user, lead, outcome, createdAt, and correlationId.
- Unique index on domain event idempotency key.
