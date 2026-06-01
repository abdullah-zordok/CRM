# Data Model: Users & RBAC

## Overview

Phase 1 replaces the Phase 0 minimal foundation identity model with managed
platform users, fixed business roles, a permission matrix, team scoping,
activation setup, immediate access revocation, and searchable audit review. It
does not introduce CRM business records such as leads, activities, deals,
revenue, targets, exhibitions, notifications, WhatsApp conversations, or AI
insights.

## Entities

### PlatformUser

Managed identity for a CRM platform user.

**Fields**:
- `id`: Stable unique identifier.
- `email`: Unique login email, normalized to lowercase.
- `displayName`: Human-readable user name.
- `status`: `PENDING_ACTIVATION`, `ACTIVE`, or `DISABLED`.
- `activatedAt`: Timestamp when initial setup completed, nullable.
- `disabledAt`: Timestamp when access was disabled, nullable.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Has many `RoleAssignment` records.
- Has zero or one active `TeamMembership`.
- Has many historical `TeamMembership` records.
- Has many `AuthSession` records.
- Has many `ActivationToken` records.
- May appear as actor or target on `SecurityAuditRecord`.

**Validation rules**:
- Email is required, unique, normalized, and valid email format.
- Display name is required.
- Newly created users start as `PENDING_ACTIVATION` unless explicitly disabled.
- Disabled users cannot access protected areas.
- The migrated seeded Admin must become an active PlatformUser with Admin role.

**State transitions**:
- `PENDING_ACTIVATION` -> `ACTIVE` when credential setup completes.
- `PENDING_ACTIVATION` -> `DISABLED` if Admin disables before activation.
- `ACTIVE` -> `DISABLED` when Admin disables the user.
- `DISABLED` -> `ACTIVE` when Admin re-enables a previously activated user.

### BusinessRole

Fixed Phase 1 business role used by the permission matrix.

**Fields**:
- `id`: Stable unique identifier.
- `code`: Unique value: `ADMIN`, `MANAGER`, or `SALES_REPRESENTATIVE`.
- `name`: Display label.
- `description`: Operational description.
- `isSystemManaged`: Always true for Phase 1 roles.
- `createdAt`: Creation timestamp.

**Relationships**:
- Has many `RoleAssignment` records.
- Has many `PermissionGrant` records.

**Validation rules**:
- Codes are fixed and seeded.
- Role creation, deletion, and permission editing are out of scope.
- At least one active PlatformUser must have the Admin role.

### OperationsReviewerAccessProfile

Read-only access profile for searchable security audit review.

**Fields**:
- `id`: Stable unique identifier.
- `code`: Fixed value `OPERATIONS_REVIEWER`.
- `name`: Display label.
- `description`: Audit-only operational description.
- `createdAt`: Creation timestamp.

**Relationships**:
- May be assigned to PlatformUsers through `ReviewerAssignment`.
- Grants only audit-search and audit-view permissions.

**Validation rules**:
- Cannot manage users, roles, teams, sessions, or CRM business records.
- Does not count as a business role for team or future CRM ownership.

### Permission

Named action that can be allowed or denied by the fixed matrix.

**Fields**:
- `id`: Stable unique identifier.
- `code`: Unique permission code.
- `resource`: Protected resource category.
- `action`: Protected action.
- `description`: Human-readable explanation.
- `createdAt`: Creation timestamp.

**Relationships**:
- Has many `PermissionGrant` records.
- Appears on `AccessDecision` records.

**Validation rules**:
- Permission codes are fixed for Phase 1.
- Every protected action must map to exactly one permission code.

### PermissionGrant

Fixed mapping between a role or access profile and a permission.

**Fields**:
- `id`: Stable unique identifier.
- `granteeType`: `BUSINESS_ROLE` or `ACCESS_PROFILE`.
- `granteeCode`: Role or profile code.
- `permissionCode`: Permission code.
- `createdAt`: Creation timestamp.

**Relationships**:
- References one `BusinessRole` or one `OperationsReviewerAccessProfile`.
- References one `Permission`.

**Validation rules**:
- Duplicate grantee/permission pairs are not allowed.
- Grants are seeded and not editable through Phase 1 administration.

### RoleAssignment

Assignment of a fixed business role to a user.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `PlatformUser`.
- `roleCode`: References `BusinessRole.code`.
- `assignedByUserId`: Admin who assigned the role.
- `assignedAt`: Assignment timestamp.
- `removedByUserId`: Admin who removed the role, nullable.
- `removedAt`: Removal timestamp, nullable.
- `status`: `ACTIVE` or `REMOVED`.

**Relationships**:
- Belongs to one PlatformUser.
- Belongs to one BusinessRole.
- May be referenced by `SecurityAuditRecord`.

**Validation rules**:
- Duplicate active user/role pairs are not allowed.
- Removing Admin role is blocked if it would leave zero active Admin users.
- Removing a role immediately revokes sessions affected by the removed access.

**State transitions**:
- `ACTIVE` -> `REMOVED` when Admin removes the role.

### ReviewerAssignment

Assignment of the read-only operations reviewer access profile.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `PlatformUser`.
- `assignedByUserId`: Admin who assigned the profile.
- `assignedAt`: Assignment timestamp.
- `removedByUserId`: Admin who removed the profile, nullable.
- `removedAt`: Removal timestamp, nullable.
- `status`: `ACTIVE` or `REMOVED`.

**Relationships**:
- Belongs to one PlatformUser.
- Belongs to the Operations Reviewer access profile.

**Validation rules**:
- Grants audit review only.
- Removing reviewer access immediately prevents further audit review.

### Team

Sales operations grouping used for future CRM ownership and manager scoping.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Unique team name.
- `status`: `ACTIVE` or `INACTIVE`.
- `createdByUserId`: Admin who created the team.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.
- `deactivatedAt`: Deactivation timestamp, nullable.

**Relationships**:
- Has many `TeamMembership` records.
- May have one or more users with Manager role as active members.

**Validation rules**:
- Active team names must be unique.
- Inactive teams cannot receive new active members.
- Deactivation must not silently remove historical membership records.

**State transitions**:
- `ACTIVE` -> `INACTIVE` when Admin deactivates the team.
- `INACTIVE` -> `ACTIVE` if Admin reactivates the team.

### TeamMembership

Relationship between a user and a team.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `PlatformUser`.
- `teamId`: References `Team`.
- `membershipType`: `MEMBER` or `MANAGER`.
- `status`: `ACTIVE` or `ENDED`.
- `assignedByUserId`: Admin who assigned the membership.
- `assignedAt`: Assignment timestamp.
- `endedByUserId`: Admin who ended the membership, nullable.
- `endedAt`: End timestamp, nullable.

**Relationships**:
- Belongs to one PlatformUser.
- Belongs to one Team.
- May be referenced by `SecurityAuditRecord`.

**Validation rules**:
- A user may have no more than one active TeamMembership.
- Manager membership requires the Manager business role.
- Assigning a user to a new team ends any previous active membership.
- Historical memberships are retained.

**State transitions**:
- `ACTIVE` -> `ENDED` when user moves teams or membership is removed.

### ActivationToken

Time-limited setup path for a newly created user.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `PlatformUser`.
- `tokenHash`: Hash of the activation secret.
- `status`: `ACTIVE`, `USED`, `EXPIRED`, or `REVOKED`.
- `expiresAt`: Expiration timestamp.
- `usedAt`: Completion timestamp, nullable.
- `revokedAt`: Revocation timestamp, nullable.
- `createdByUserId`: Admin who created or resent activation.
- `createdAt`: Creation timestamp.

**Relationships**:
- Belongs to one PlatformUser.
- May be referenced by `SecurityAuditRecord`.

**Validation rules**:
- Raw activation secrets are never persisted.
- Only active, unexpired tokens can complete credential setup.
- Resending activation revokes any prior active activation token for the user.

**State transitions**:
- `ACTIVE` -> `USED` when setup completes.
- `ACTIVE` -> `EXPIRED` after expiration.
- `ACTIVE` -> `REVOKED` when superseded or user is disabled.

### AuthSession

Authenticated access state for a platform user.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References `PlatformUser`.
- `sessionHash`: Hash of session token or session identifier.
- `status`: `ACTIVE`, `REVOKED`, or `EXPIRED`.
- `issuedAt`: Session creation timestamp.
- `expiresAt`: Session expiration timestamp.
- `revokedAt`: Revocation timestamp, nullable.
- `revocationReason`: `LOGOUT`, `USER_DISABLED`, `ROLE_REMOVED`,
  `REVIEWER_ACCESS_REMOVED`, or `SECURITY_REVOKE`, nullable.
- `lastSeenAt`: Last authenticated request timestamp, nullable.

**Relationships**:
- Belongs to one PlatformUser.
- May be referenced by `SecurityAuditRecord` and `AccessDecision`.

**Validation rules**:
- Raw session tokens are never persisted.
- Disabled users cannot retain active sessions.
- Sessions affected by required role removal are revoked immediately.

**State transitions**:
- `ACTIVE` -> `REVOKED` on logout, disablement, required role removal, reviewer
  access removal, or security revocation.
- `ACTIVE` -> `EXPIRED` when past expiration.

### AccessDecision

Recorded allow/deny result for a protected action.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: References PlatformUser, nullable for anonymous requests.
- `permissionCode`: Requested permission.
- `resource`: Protected resource category.
- `action`: Requested action.
- `decision`: `ALLOW` or `DENY`.
- `reason`: Machine-readable reason.
- `correlationId`: Request correlation identifier.
- `decidedAt`: Decision timestamp.

**Relationships**:
- May produce one `SecurityAuditRecord`.

**Validation rules**:
- Every protected action must produce an allow or deny decision.
- Denied decisions for protected areas must be auditable.
- Every decision must include a correlation identifier.

### SecurityAuditRecord

Append-only record of security-sensitive Phase 1 behavior.

**Fields**:
- `id`: Stable unique identifier.
- `eventType`: `USER_CREATED`, `USER_UPDATED`, `USER_DISABLED`,
  `USER_ENABLED`, `ACTIVATION_SENT`, `ACTIVATION_USED`, `ACTIVATION_EXPIRED`,
  `ROLE_ASSIGNED`, `ROLE_REMOVED`, `REVIEWER_ASSIGNED`,
  `REVIEWER_REMOVED`, `TEAM_CREATED`, `TEAM_UPDATED`, `TEAM_DEACTIVATED`,
  `TEAM_MEMBERSHIP_CHANGED`, `SESSION_REVOKED`, `AUDIT_VIEWED`,
  `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `ACCESS_ALLOWED`,
  or `ACCESS_DENIED`.
- `actorUserId`: Acting PlatformUser, nullable for system events.
- `targetUserId`: Affected PlatformUser, nullable.
- `resource`: Affected resource, nullable.
- `outcome`: `SUCCESS`, `FAILURE`, or `DENIED`.
- `ipAddress`: Request IP if available.
- `userAgent`: Request user agent if available.
- `correlationId`: Request or operation correlation identifier.
- `metadata`: Sanitized JSON metadata with no secrets, raw tokens, passwords, or
  stack traces.
- `createdAt`: Audit timestamp.

**Relationships**:
- May reference actor and target PlatformUsers.
- May reference sessions, role assignments, team memberships, or activation
  records through sanitized identifiers in metadata.

**Validation rules**:
- Audit records are append-only.
- Required security-sensitive actions must create audit records.
- Metadata must be redacted before persistence and before display.

### AdministrationEvent

Internal event signal for user and RBAC administration changes.

**Fields**:
- `id`: Stable unique identifier.
- `name`: Stable event name.
- `version`: Event contract version.
- `payload`: Sanitized JSON payload.
- `idempotencyKey`: Unique key for repeated administrative submissions.
- `correlationId`: Request correlation identifier.
- `status`: `RECORDED`, `DISPATCHED`, `HANDLED`, or `FAILED`.
- `createdAt`: Event creation timestamp.
- `handledAt`: Handler completion timestamp, nullable.

**Relationships**:
- May correspond to one or more SecurityAuditRecords.

**Validation rules**:
- Payload must not include raw secrets or CRM business data.
- Event name and version are required.
- Idempotency key is required for repeatable administrative submissions.

## Data Retention

- Platform users, roles, permissions, teams, and assignments are retained for
  auditability unless a later compliance process defines redaction.
- Activation tokens retain only hashed secrets and may be purged after expiry or
  use according to operational policy.
- Sessions may be purged after expiration or revocation once audit needs are met.
- Security audit records are append-only in Phase 1.
- Administration events may be retained for troubleshooting and audit
  correlation.

## Indexing And Uniqueness

- Unique index on `PlatformUser.email`.
- Unique index on `BusinessRole.code`.
- Unique index on `OperationsReviewerAccessProfile.code`.
- Unique index on `Permission.code`.
- Unique composite index on active `RoleAssignment.userId` + `roleCode`.
- Unique active membership index on `TeamMembership.userId`.
- Unique active team name index on `Team.name`.
- Index `PlatformUser.status`.
- Index `PlatformUser.displayName` and `email` for user search.
- Index `RoleAssignment.roleCode` and `status`.
- Index `TeamMembership.teamId`, `userId`, and `status`.
- Index `AuthSession.userId` and `status`.
- Index `ActivationToken.userId`, `status`, and `expiresAt`.
- Index `SecurityAuditRecord.actorUserId`, `targetUserId`, `eventType`,
  `outcome`, `createdAt`, and `correlationId`.
- Unique index on `AdministrationEvent.idempotencyKey`.
