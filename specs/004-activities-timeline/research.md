# Research: Activities Timeline

## Decision: Activities are lead-scoped in Phase 3

**Rationale**: The current CRM core already treats Lead as the central aggregate and has lead
ownership, team scope, permissions, notes, assignment history, and status history. Scoping
activities to leads delivers the requested timeline capability while reusing existing access rules
and avoiding premature deal, exhibition, or account timelines.

**Alternatives considered**:

- General activity entity attachable to any CRM object: rejected for Phase 3 because deals,
  exhibitions, and accounts are not implemented as full aggregates yet.
- Standalone personal task list: rejected because the spec requires activity history tied to lead
  accountability and team review.

## Decision: Model completed activities and planned follow-ups in one activity record

**Rationale**: Users need a single timeline that shows both completed history and open planned
follow-ups. One activity record with status and relevant timestamps keeps filtering and lead
timeline ordering straightforward while preserving follow-up lifecycle state.

**Alternatives considered**:

- Separate Activity and Task aggregates: rejected because it would duplicate lead, owner, note,
  due-state, audit, and permission logic for this phase.
- Notes-only activity history: rejected because follow-ups require owner, due date, status,
  completion, reassignment, and overdue handling.

## Decision: Completed history is append-only with audited correction entries

**Rationale**: The constitution requires auditable operations and append-only activity timelines.
Corrections are allowed only when they preserve original recorder/time and create a visible
correction/audit trail.

**Alternatives considered**:

- Direct edit of completed activities: rejected because it can hide accountability.
- No correction path: rejected because users need a controlled way to fix mistakes without deleting
  sales history.

## Decision: Reuse existing Lead access service for activity authorization

**Rationale**: Activities inherit sensitivity from the related lead, including customer contact
details, notes, owner, and team. Reusing lead access keeps denial behavior consistent across lead
detail, lead lists, and activity operations.

**Alternatives considered**:

- Independent activity ACL: rejected because it could conflict with lead visibility and increase
  security risk.
- UI-only filtering: rejected because protected action checks must happen at the API boundary.

## Decision: Emit internal domain events, no queue jobs in Phase 3

**Rationale**: Activity events must support future notifications, analytics, and automation, but
this phase does not deliver those downstream workflows. Synchronous internal event recording with
correlation IDs is sufficient; retryable external delivery can be introduced when a consumer exists.

**Alternatives considered**:

- BullMQ jobs for every activity event: rejected because there are no asynchronous side effects in
  this phase.
- No domain events: rejected because future Notification and Analytics capabilities need stable
  event names and payloads.

## Decision: Workspace filters prioritize overdue follow-ups and owner/team review

**Rationale**: The highest-value manager flow is identifying stale or overdue work quickly.
Filtering by owner, team scope, status, type, date range, and due state directly supports the
specified success criteria.

**Alternatives considered**:

- Timeline-only lead detail view: rejected because managers need cross-lead review.
- Broad free-text search first: deferred because structured filters are more testable and map to
  expected indexes.

## Decision: Use optimistic version checks for follow-up state changes

**Rationale**: The spec calls out concurrent updates. Version checks prevent one user from silently
overwriting another user's completion, reassignment, cancellation, or correction.

**Alternatives considered**:

- Last-write-wins updates: rejected because it can lose business-critical follow-up outcomes.
- Manual record locks: rejected as heavier than needed for short CRM form updates.
