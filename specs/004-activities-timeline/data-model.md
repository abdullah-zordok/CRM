# Data Model: Activities Timeline

## Entity: Activity

Represents a completed customer-facing interaction or a planned follow-up tied to a lead.

### Fields

- `id`: Stable activity identifier.
- `leadId`: Related lead identifier. Required.
- `type`: Activity type. Allowed values: `CALL`, `EMAIL`, `MEETING`, `EXHIBITION_VISIT`,
  `WHATSAPP`, `OTHER`.
- `status`: Lifecycle status. Allowed values: `PLANNED`, `DUE_TODAY`, `OVERDUE`, `COMPLETED`,
  `CANCELED`.
- `ownerUserId`: User responsible for the activity or follow-up.
- `teamId`: Team scope copied from the lead or assigned owner context when available.
- `recordedByUserId`: User who created the activity record.
- `activityAt`: Date/time when a completed activity happened. Required when status is `COMPLETED`.
- `dueAt`: Date/time when a planned follow-up is due. Required when status is `PLANNED`,
  `DUE_TODAY`, or `OVERDUE`.
- `completedAt`: Date/time when a follow-up was completed.
- `canceledAt`: Date/time when a planned activity was canceled.
- `outcome`: Required for completed activities and completed follow-ups. Examples: `CONNECTED`,
  `NO_ANSWER`, `QUALIFIED_INTEREST`, `FOLLOW_UP_REQUIRED`, `NOT_INTERESTED`, `OTHER`.
- `note`: Optional business note with length limit and sensitive-data warning.
- `cancellationReason`: Optional reason when status is `CANCELED`.
- `version`: Positive integer used for stale update prevention.
- `createdAt`, `updatedAt`: Audit timestamps.
- `correlationId`: Request/event correlation identifier.

### Validation Rules

- `leadId`, `type`, `ownerUserId`, and `recordedByUserId` are always required.
- A completed activity requires `activityAt` and `outcome`.
- A planned follow-up requires `dueAt`.
- Completing a follow-up requires current `version`, `outcome`, and `completedAt`.
- Reassigning a follow-up requires current `version` and an eligible owner within permitted scope.
- Canceling a planned activity requires current `version` and keeps the record visible.
- Notes must be trimmed, length-limited, and rejected or warned when they appear to contain
  credential/payment/system-secret patterns.
- New planned follow-ups cannot be created for archived leads.

### Relationships

- Belongs to one Lead.
- References one owner User.
- References one recorder User.
- May reference one Team for scope/filtering.
- Has many ActivityAuditEntry records.
- Emits ActivityDomainEvent records through the existing event pathway.

## Entity: ActivityAuditEntry

Represents security-relevant changes to an activity.

### Fields

- `id`: Stable audit entry identifier.
- `activityId`: Related activity identifier when available.
- `leadId`: Related lead identifier.
- `actorUserId`: User who attempted or performed the action.
- `eventType`: `ACTIVITY_CREATED`, `FOLLOW_UP_SCHEDULED`, `FOLLOW_UP_COMPLETED`,
  `FOLLOW_UP_REASSIGNED`, `ACTIVITY_CANCELED`, `ACTIVITY_CORRECTED`, `ACTIVITY_ACCESS_DENIED`.
- `outcome`: `SUCCESS`, `FAILURE`, or `DENIED`.
- `metadata`: Redacted context such as previous owner, new owner, previous status, new status, and
  version.
- `createdAt`: Audit timestamp.
- `correlationId`: Request correlation identifier.

### Validation Rules

- Metadata must be redacted before storage or display.
- Denied attempts must not include restricted customer details.
- Audit entries are append-only.

## Entity: ActivityDomainEvent

Represents business events emitted for future notification, analytics, and automation consumers.

### Fields

- `eventName`: `ActivityCreated`, `FollowUpScheduled`, `FollowUpCompleted`,
  `FollowUpReassigned`, `ActivityCanceled`, `ActivityCorrected`.
- `activityId`: Related activity identifier.
- `leadId`: Related lead identifier.
- `ownerUserId`: Current owner.
- `actorUserId`: User who caused the event.
- `occurredAt`: Event time.
- `payload`: Stable typed payload with non-sensitive business context.
- `correlationId`: Request correlation identifier.

### Validation Rules

- Event names are stable and versionable.
- Payloads must not include secrets, credentials, or unrestricted note bodies unless explicitly
  needed by a permitted internal consumer.
- Emission occurs in the same business transaction as the state change where possible.

## Entity: ActivityFilter

Represents the current review context for activity lists.

### Fields

- `leadId`: Optional related lead filter.
- `ownerUserId`: Optional owner filter.
- `teamId`: Optional team scope filter.
- `type`: Optional activity type filter.
- `status`: Optional lifecycle status filter.
- `dueState`: Optional `OPEN`, `DUE_TODAY`, `OVERDUE`, `COMPLETED`, or `CANCELED` filter.
- `from`, `to`: Optional date range.
- `page`, `pageSize`: Pagination controls.

### Validation Rules

- Date range must be valid when both dates are supplied.
- User/team filters must be checked against the requester's permitted scope.
- Pagination must have bounded page size.

## State Transitions

```text
PLANNED -> DUE_TODAY      automatic due-state display when due date is today
PLANNED -> OVERDUE        automatic due-state display when due date has passed
PLANNED -> COMPLETED      permitted complete action with outcome and version
DUE_TODAY -> COMPLETED    permitted complete action with outcome and version
OVERDUE -> COMPLETED      permitted complete action with outcome and version
PLANNED -> CANCELED       permitted cancel action with version
DUE_TODAY -> CANCELED     permitted cancel action with version
OVERDUE -> CANCELED       permitted cancel action with version
COMPLETED -> COMPLETED    correction appends audit/correction record only
CANCELED -> CANCELED      no reopening in Phase 3
```

## Indexes and Query Paths

- Lead timeline: `(leadId, activityAt, dueAt, createdAt)`.
- Workspace filters: `(ownerUserId, status, dueAt)`, `(teamId, status, dueAt)`,
  `(type, status, createdAt)`.
- Audit lookup: `(activityId, createdAt)` and `(leadId, createdAt)`.
- Idempotency/future event lookup: `(correlationId, eventName)`.

## Transaction Boundaries

- Create completed activity: validate lead access, save activity, append audit entry, emit domain
  event.
- Schedule follow-up: validate lead access and owner eligibility, save activity, append audit entry,
  emit domain event.
- Complete/reassign/cancel/correct: validate version and permissions, update activity, append audit
  entry, emit domain event.
