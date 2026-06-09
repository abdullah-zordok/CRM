# Data Model: Exhibitions Module

## Overview

Phase 4 introduces first-class Exhibition records for field sales event management. It builds on
Users/RBAC, Leads Core, Activities Timeline, audit records, and domain event conventions while
adding exhibition lifecycle, representative attendance, lead attribution, reconciliation of
lightweight exhibition references, scoped summaries, history, access decisions, and exhibition
domain events. It does not introduce deals, revenue, target calculations, commissions, executive
ROI dashboards, notifications, import/export, AI scoring, or mobile-specific records.

## Entities

### Exhibition

Trade show, event, or field sales venue where representatives meet prospects.

**Fields**:

- `id`: Stable unique identifier.
- `name`: Required event name.
- `startsAt`: Event start date/time.
- `endsAt`: Event end date/time.
- `location`: Required location label.
- `status`: `PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELED`, or `ARCHIVED`.
- `ownerUserId`: Responsible owner; references `PlatformUser`.
- `teamId`: Team scope when available; references `Team`.
- `notes`: Optional planning notes.
- `archiveReason`: Optional reason when archived.
- `version`: Monotonic version used to reject stale updates.
- `createdByUserId`: User who created the exhibition.
- `updatedByUserId`: User who last updated the exhibition.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.
- `archivedAt`: Archive timestamp, nullable.
- `correlationId`: Request correlation identifier.

**Relationships**:

- Belongs to one owner `PlatformUser`.
- May belong to one `Team`.
- Has many `ExhibitionAttendee` records.
- Has many `ExhibitionLeadAttribution` records.
- Has many `ExhibitionHistoryEntry` records.
- Has many `ExhibitionAccessDecision` records.
- Has many `ExhibitionDomainEvent` records.

**Validation rules**:

- Name, location, start, end, owner, and status are required.
- End must be after start.
- Owner must be active and eligible.
- Archived exhibitions cannot receive normal updates, attendance changes, or attribution changes.
- Updates must include current `version`; stale versions are rejected.
- Notes must be length-limited and reject obvious credential, payment, or secret material.

**State transitions**:

- Normal flow: `PLANNED` -> `ACTIVE` -> `COMPLETED`.
- Cancellation: `PLANNED` or `ACTIVE` -> `CANCELED`.
- Archive: any non-archived status -> `ARCHIVED` by Admin or permitted Manager.
- Restore: `ARCHIVED` -> prior permitted active historical status by Admin or permitted Manager.
- Corrections require history and audit records.

### ExhibitionAttendee

Representative assignment and attendance confirmation for an exhibition.

**Fields**:

- `id`: Stable unique identifier.
- `exhibitionId`: References `Exhibition`.
- `userId`: Assigned attendee; references `PlatformUser`.
- `teamId`: Attendee team scope when assigned.
- `plannedRole`: Optional role label for the event.
- `status`: `PLANNED`, `CONFIRMED`, `ABSENT`, `REMOVED`, or `CORRECTED`.
- `confirmedAt`: Attendance confirmation timestamp, nullable.
- `confirmedByUserId`: User who confirmed attendance, nullable.
- `assignedByUserId`: User who assigned the attendee.
- `removedByUserId`: User who removed the attendee, nullable.
- `correctionReason`: Optional reason when corrected.
- `version`: Monotonic version for stale update rejection.
- `createdAt`: Assignment timestamp.
- `updatedAt`: Last update timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:

- Belongs to one `Exhibition`.
- Belongs to one attendee `PlatformUser`.
- May belong to one `Team`.
- Produces `ExhibitionHistoryEntry`, audit record, and `ExhibitionDomainEvent` records.

**Validation rules**:

- Attendee must be active and eligible.
- Managers can assign attendees only within permitted team scope.
- Sales Representatives cannot assign other attendees.
- Finalized attendance cannot be silently overwritten; corrections preserve prior state.

### ExhibitionLeadAttribution

Relationship between a lead and the exhibition that sourced or influenced the lead.

**Fields**:

- `id`: Stable unique identifier.
- `exhibitionId`: References `Exhibition`.
- `leadId`: References `Lead`.
- `attributionType`: `SOURCE`, `INFLUENCE`, or `CORRECTION`.
- `status`: `ACTIVE`, `REMOVED`, or `CORRECTED`.
- `sourceReferenceName`: Original lightweight reference name, nullable.
- `sourceReferenceDate`: Original lightweight reference date, nullable.
- `sourceReferenceLocation`: Original lightweight reference location, nullable.
- `createdByUserId`: User who linked the lead.
- `updatedByUserId`: User who corrected or removed the attribution, nullable.
- `correctionReason`: Optional reason for correction/removal.
- `version`: Monotonic version for stale update rejection.
- `createdAt`: Attribution timestamp.
- `updatedAt`: Last update timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:

- Belongs to one `Exhibition`.
- Belongs to one `Lead`.
- May reference original `LeadExhibitionReference` values in preserved fields.
- Produces lead history, exhibition history, audit records, and domain events.

**Validation rules**:

- Lead must be visible to the acting user.
- Exhibition must be visible to the acting user.
- Active lead-to-exhibition source attribution must be unique per lead unless later phases allow
  multi-source attribution.
- Corrections and removals preserve prior attribution history.
- Archived exhibitions cannot receive new active attributions unless restored.

### ExhibitionPerformanceSummary

Scoped review projection for exhibition performance.

**Fields**:

- `exhibitionId`: Related exhibition.
- `attributedLeadCount`: Count of active attributed leads in viewer scope.
- `leadStatusDistribution`: Counts by visible lead status.
- `attendeeCount`: Count of active or confirmed attendees in viewer scope.
- `confirmedAttendanceCount`: Count of confirmed attendees.
- `openFollowUpCount`: Count of visible open follow-ups for attributed leads.
- `overdueFollowUpCount`: Count of visible overdue follow-ups for attributed leads.
- `recentActivityCount`: Count of recent visible activities for attributed leads.
- `lastActivityAt`: Latest visible activity timestamp, nullable.
- `generatedAt`: Summary generation timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:

- Derived from `Exhibition`, `ExhibitionAttendee`, `ExhibitionLeadAttribution`, `Lead`, and
  `Activity` records.

**Validation rules**:

- Summary values are scoped to the viewer's permitted exhibition, lead, attendee, and team data.
- Missing data must render as empty or zero-value states with clear wording.
- Revenue, commission, and ROI values are excluded in Phase 4.

### ExhibitionHistoryEntry

Append-only business history for exhibition changes.

**Fields**:

- `id`: Stable unique identifier.
- `exhibitionId`: References `Exhibition`.
- `entryType`: `CREATED`, `UPDATED`, `STATUS_CHANGED`, `ARCHIVED`, `RESTORED`,
  `ATTENDEE_ASSIGNED`, `ATTENDANCE_CONFIRMED`, `ATTENDANCE_CORRECTED`,
  `LEAD_ATTRIBUTED`, `ATTRIBUTION_CORRECTED`, `ATTRIBUTION_REMOVED`,
  `STALE_UPDATE_REJECTED`, or `ACCESS_DENIED`.
- `actorUserId`: Acting user, nullable for system events.
- `leadId`: Related lead, nullable.
- `attendeeUserId`: Related attendee, nullable.
- `summary`: Human-readable sanitized summary.
- `metadata`: Sanitized structured metadata.
- `createdAt`: Entry timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:

- Belongs to one `Exhibition`.
- May reference one `Lead`.
- May reference one attendee `PlatformUser`.
- Corresponds to audit and domain event records where applicable.

**Validation rules**:

- Entries are append-only.
- Metadata must not include secrets, stack traces, hidden audit metadata, or restricted lead details.

### ExhibitionAccessDecision

Allow or deny result for protected exhibition actions.

**Fields**:

- `id`: Stable unique identifier.
- `userId`: Acting user, nullable for anonymous requests.
- `exhibitionId`: Exhibition being accessed, nullable for create/list scope checks.
- `leadId`: Lead being attributed or reviewed, nullable.
- `action`: `CREATE`, `VIEW`, `UPDATE`, `ARCHIVE`, `RESTORE`, `ASSIGN_ATTENDEE`,
  `CONFIRM_ATTENDANCE`, `ATTRIBUTE_LEAD`, `VIEW_SUMMARY`, or `SEARCH`.
- `decision`: `ALLOW` or `DENY`.
- `reason`: Machine-readable reason.
- `scope`: `GLOBAL`, `TEAM`, `ATTENDEE`, `OWNED_LEAD`, `EXPLICIT`, or `NONE`.
- `createdAt`: Decision timestamp.
- `correlationId`: Request correlation identifier.

**Relationships**:

- May belong to one `Exhibition`.
- May belong to one `Lead`.
- May produce a security audit record.

**Validation rules**:

- Every protected exhibition action must produce an access decision.
- Denied protected actions must be auditable.
- Denials must not reveal restricted lead, attendee, or exhibition details.

### ExhibitionDomainEvent

Recorded event signal for exhibition business changes.

**Fields**:

- `id`: Stable unique identifier.
- `name`: `ExhibitionCreated`, `ExhibitionUpdated`, `ExhibitionStatusChanged`,
  `ExhibitionAttendeeAssigned`, `ExhibitionAttendanceConfirmed`,
  `ExhibitionLeadAttributed`, or `ExhibitionAttributionCorrected`.
- `version`: Event contract version.
- `exhibitionId`: References `Exhibition`.
- `leadId`: Related lead, nullable.
- `attendeeUserId`: Related attendee, nullable.
- `payload`: Sanitized JSON payload.
- `idempotencyKey`: Unique key for repeatable submissions.
- `correlationId`: Request correlation identifier.
- `status`: `RECORDED`, `DISPATCHED`, `HANDLED`, or `FAILED`.
- `createdAt`: Event creation timestamp.
- `handledAt`: Handler completion timestamp, nullable.

**Relationships**:

- Belongs to one `Exhibition`.
- May correspond to one `Lead`.
- May correspond to one attendee `PlatformUser`.
- May correspond to one or more audit records and history entries.

**Validation rules**:

- Event name and version are required.
- Payload must be sanitized and scoped to what downstream consumers need.
- Idempotency key is required for repeatable submissions.

## Data Retention

- Active, completed, canceled, and archived exhibitions are retained for operational
  accountability unless a later compliance process defines redaction.
- Attendance, attribution, and exhibition history are append-only for normal workflows.
- Lightweight exhibition reference values are retained on attribution records for reconciliation.
- Access decisions, audit records, and domain events are retained for security, troubleshooting, and
  analytics correlation according to project audit policy.
- Revenue ROI and executive analytics retention policies are deferred to later phases.

## Indexing And Uniqueness

- Index `Exhibition.status`.
- Index `Exhibition.teamId`.
- Index `Exhibition.ownerUserId`.
- Index `Exhibition.startsAt` and `endsAt`.
- Text/search-supporting index for exhibition name and location.
- Index `Exhibition.version` for stale update checks.
- Unique active index on normalized exhibition name plus start date where practical.
- Index `ExhibitionAttendee.exhibitionId`, `userId`, `teamId`, `status`, and `createdAt`.
- Unique active index on `ExhibitionAttendee.exhibitionId` plus `userId`.
- Index `ExhibitionLeadAttribution.exhibitionId`, `leadId`, `status`, and `createdAt`.
- Unique active index on `ExhibitionLeadAttribution.leadId` for active source attribution.
- Index `ExhibitionHistoryEntry.exhibitionId`, `entryType`, `actorUserId`, `leadId`,
  `attendeeUserId`, and `createdAt`.
- Index `ExhibitionAccessDecision.userId`, `exhibitionId`, `leadId`, `action`, `decision`, and
  `createdAt`.
- Unique index on `ExhibitionDomainEvent.idempotencyKey`.
- Index `ExhibitionDomainEvent.exhibitionId`, `leadId`, `attendeeUserId`, `name`, `status`, and
  `createdAt`.
