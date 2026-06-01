# Data Model: Leads Core

## Overview

Phase 2 introduces the Lead as the central CRM business aggregate. It builds on
Phase 1 users, roles, teams, sessions, permissions, and audit behavior while
adding lead creation, assignment, status tracking, source tracking, lightweight
exhibition references, append-only notes, history, access decisions, and lead
domain events. It does not introduce full activities, follow-up scheduling,
deals, revenue, targets, exhibitions management, analytics, notifications,
WhatsApp, AI, import/export, or mobile-specific records.

## Entities

### Lead

Central CRM record for a potential customer or opportunity.

**Fields**:
- `id`: Stable unique identifier.
- `displayName`: Required customer or opportunity name.
- `company`: Company or organization name, nullable.
- `email`: Contact email, nullable and normalized to lowercase.
- `phone`: Contact phone, nullable and normalized for duplicate checks.
- `sourceCode`: References `LeadSource.code`.
- `status`: `NEW`, `CONTACTED`, `QUALIFIED`, `NEGOTIATION`, `WON`, `LOST`, or
  `ARCHIVED`.
- `priority`: `LOW`, `MEDIUM`, `HIGH`, or `URGENT`.
- `budgetAmount`: Budget estimate, nullable.
- `budgetCurrency`: Currency code for budget estimate, nullable.
- `ownerUserId`: Current lead owner or assignee; references `PlatformUser`.
- `teamId`: Current owner team scope when available; references `Team`.
- `createdByUserId`: User who created the lead; references `PlatformUser`.
- `version`: Monotonic version used to reject stale updates.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.
- `archivedAt`: Archive timestamp, nullable.

**Relationships**:
- Belongs to one `LeadSource`.
- Belongs to one owner `PlatformUser`.
- Belongs to one creating `PlatformUser`.
- May belong to one current `Team`.
- Has zero or one current `LeadExhibitionReference`.
- Has many `LeadAssignment` records.
- Has many `LeadStatusHistory` records.
- Has many `LeadNote` records.
- Has many `LeadHistoryEntry` records.
- Has many `LeadAccessDecision` records.
- Has many `LeadDomainEvent` records.

**Validation rules**:
- `displayName` is required unless `company` is provided; at least one of the
  two must be present.
- At least one reachable contact method is required: email or phone.
- Email must be valid and normalized when provided.
- Phone must be normalized when provided.
- Active leads must be unique by normalized email or normalized phone across the
  platform. Restricted matches return privacy-safe conflict messages.
- Owner must be active and eligible for lead ownership.
- Team scope follows the current owner team membership when available.
- Updates must include the current `version`; stale versions are rejected.

**State transitions**:
- Normal Sales Representative flow: `NEW` -> `CONTACTED` -> `QUALIFIED` ->
  `NEGOTIATION` -> `WON` or `LOST`.
- Admin and Manager correction flow: active statuses may move backward or
  forward when the correction is recorded.
- Archive flow: Admin or Manager may move active statuses to `ARCHIVED`.
- Restore flow: Admin or Manager may restore `ARCHIVED` to an active status.

### LeadSource

Controlled source list for lead origin.

**Fields**:
- `id`: Stable unique identifier.
- `code`: Unique source code such as `EXHIBITION`, `REFERRAL`, `WEBSITE`,
  `INBOUND_INQUIRY`, `MANUAL_ENTRY`, or `OTHER`.
- `name`: Display label.
- `status`: `ACTIVE` or `INACTIVE`.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Has many `Lead` records.

**Validation rules**:
- Codes are unique.
- Inactive sources remain available for historical leads but cannot be selected
  for new leads.

### LeadExhibitionReference

Optional lightweight attribution for leads originating from an exhibition before
the full Exhibitions Module exists.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: References `Lead`.
- `name`: Exhibition or event name.
- `date`: Exhibition or event date, nullable if not known.
- `location`: Exhibition or event location, nullable if not known.
- `createdByUserId`: User who added the reference.
- `updatedByUserId`: User who last corrected the reference.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

**Relationships**:
- Belongs to one `Lead`.
- Changes produce `LeadHistoryEntry` records.

**Validation rules**:
- Name is required when an exhibition reference is present.
- Date and location should be captured when known.
- Reference changes must preserve history for later reconciliation.

### LeadAssignment

Historical record of lead ownership changes.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: References `Lead`.
- `fromUserId`: Previous owner, nullable for initial assignment.
- `toUserId`: New owner.
- `fromTeamId`: Previous team scope, nullable.
- `toTeamId`: New team scope, nullable.
- `assignedByUserId`: Actor who made the assignment.
- `reason`: Optional assignment reason.
- `createdAt`: Assignment timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:
- Belongs to one `Lead`.
- References previous and new `PlatformUser` owners.
- References previous and new `Team` scopes where available.
- Produces a `LeadHistoryEntry`, audit record, and `LeadDomainEvent`.

**Validation rules**:
- New owner must be active and eligible.
- Managers can assign only within permitted team scope.
- Sales Representatives cannot assign leads to other users in Phase 2.

### LeadStatusHistory

Historical record of lead status changes.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: References `Lead`.
- `fromStatus`: Previous status, nullable for initial status.
- `toStatus`: New status.
- `changedByUserId`: Actor who changed the status.
- `changeType`: `NORMAL_FLOW`, `CORRECTION`, `ARCHIVE`, or `RESTORE`.
- `reason`: Optional correction or archive reason.
- `createdAt`: Change timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:
- Belongs to one `Lead`.
- Produces a `LeadHistoryEntry`, audit record, and `LeadDomainEvent`.

**Validation rules**:
- Sales Representatives follow the normal forward flow.
- Admins and Managers may correct active status values.
- Archived leads cannot be changed by normal users.

### LeadNote

Append-only note attached to a lead.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: References `Lead`.
- `authorUserId`: User who added the note.
- `body`: Note text.
- `createdAt`: Creation timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:
- Belongs to one `Lead`.
- Belongs to one author `PlatformUser`.
- Produces a `LeadHistoryEntry`, audit record, and `LeadDomainEvent`.

**Validation rules**:
- Body is required and length-limited.
- Normal workflows do not edit or delete notes.
- Notes are visible only to users with access to the lead.
- Note metadata must not expose secrets or restricted lead details.

### LeadHistoryEntry

Append-only business history for lead changes.

**Fields**:
- `id`: Stable unique identifier.
- `leadId`: References `Lead`.
- `entryType`: `CREATED`, `CONTACT_UPDATED`, `ASSIGNED`, `STATUS_CHANGED`,
  `STATUS_CORRECTED`, `ARCHIVED`, `RESTORED`, `SOURCE_CHANGED`,
  `EXHIBITION_REFERENCE_CHANGED`, `NOTE_ADDED`, `DUPLICATE_BLOCKED`, or
  `STALE_UPDATE_REJECTED`.
- `actorUserId`: Acting user, nullable for system events.
- `summary`: Human-readable sanitized summary.
- `metadata`: Sanitized structured metadata.
- `createdAt`: Entry timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:
- Belongs to one `Lead`.
- May reference assignment, status history, note, or exhibition reference ids in
  sanitized metadata.

**Validation rules**:
- Entries are append-only.
- Metadata must not include raw secrets, stack traces, or restricted lead
  details beyond the viewer's scope.

### LeadAccessDecision

Allow or deny result for a protected lead action.

**Fields**:
- `id`: Stable unique identifier.
- `userId`: Acting user, nullable for anonymous requests.
- `leadId`: Lead being accessed, nullable when create/list scope is evaluated.
- `action`: `CREATE`, `VIEW`, `UPDATE`, `ASSIGN`, `CHANGE_STATUS`, `ADD_NOTE`,
  `VIEW_HISTORY`, or `SEARCH`.
- `decision`: `ALLOW` or `DENY`.
- `reason`: Machine-readable reason.
- `scope`: `GLOBAL`, `TEAM`, `OWNED`, `EXPLICIT`, or `NONE`.
- `createdAt`: Decision timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:
- May belong to one `Lead`.
- May produce a security audit record.

**Validation rules**:
- Every protected lead action must produce an access decision.
- Denied protected actions must be auditable.
- Decisions include correlation identifiers.

### LeadDomainEvent

Recorded event signal for lead business changes.

**Fields**:
- `id`: Stable unique identifier.
- `name`: `LeadCreated`, `LeadAssigned`, `LeadStatusChanged`,
  `LeadSourceChanged`, `LeadExhibitionReferenceChanged`, or `LeadNoteAdded`.
- `version`: Event contract version.
- `leadId`: References `Lead`.
- `payload`: Sanitized JSON payload.
- `idempotencyKey`: Unique key for repeatable submissions.
- `correlationId`: Request correlation identifier.
- `status`: `RECORDED`, `DISPATCHED`, `HANDLED`, or `FAILED`.
- `createdAt`: Event creation timestamp.
- `handledAt`: Handler completion timestamp, nullable.

**Relationships**:
- Belongs to one `Lead`.
- May correspond to one or more audit records and history entries.

**Validation rules**:
- Event name and version are required.
- Payload must not include raw secrets, restricted details, or unnecessary
  customer data.
- Idempotency key is required for repeatable lead submissions.

## Data Retention

- Active and archived leads are retained for operational accountability unless a
  later compliance process defines redaction.
- Lead notes, lead history, assignment history, and status history are
  append-only for normal workflows.
- Lightweight exhibition references are retained with change history for later
  reconciliation.
- Access decisions, audit records, and domain events are retained for security,
  troubleshooting, and analytics correlation according to project audit policy.
- Higher-volume archival and export policies are deferred to later operational
  or analytics phases.

## Indexing And Uniqueness

- Unique active index on normalized lead email.
- Unique active index on normalized lead phone.
- Index `Lead.status`.
- Index `Lead.sourceCode`.
- Index `Lead.priority`.
- Index `Lead.ownerUserId`.
- Index `Lead.teamId`.
- Index `Lead.createdByUserId`.
- Index `Lead.createdAt` and `updatedAt`.
- Text/search-supporting index for lead display name, company, normalized email,
  and normalized phone.
- Index `Lead.version` for stale update checks.
- Index `LeadAssignment.leadId`, `toUserId`, `toTeamId`, and `createdAt`.
- Index `LeadStatusHistory.leadId`, `toStatus`, and `createdAt`.
- Index `LeadNote.leadId`, `authorUserId`, and `createdAt`.
- Index `LeadHistoryEntry.leadId`, `entryType`, `actorUserId`, and `createdAt`.
- Index `LeadAccessDecision.userId`, `leadId`, `action`, `decision`, and
  `createdAt`.
- Unique index on `LeadDomainEvent.idempotencyKey`.
- Index `LeadDomainEvent.leadId`, `name`, `status`, and `createdAt`.
