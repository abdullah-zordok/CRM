# Feature Specification: Activities Timeline

**Feature Branch**: `005-activities-timeline`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Phase 3 - Activities Timeline from plan.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record lead activities (Priority: P1)

Sales representatives need to record customer-facing activity against a lead so the next
responsible person can understand what happened, when it happened, and what should happen next.

**Why this priority**: Activity capture is the core value of the feature. Without it, the
activities area remains only a placeholder and sales follow-up still depends on memory or external
notes.

**Independent Test**: A sales representative can open an eligible lead, add a completed activity
with type, outcome, date, participant context, and optional next step, then see the activity appear
in that lead's timeline.

**Acceptance Scenarios**:

1. **Given** a sales representative has access to a lead, **When** they add a call activity with a
   valid outcome and activity time, **Then** the activity appears in chronological context on the
   lead timeline.
2. **Given** required activity details are missing, **When** the sales representative tries to save
   the activity, **Then** the system explains what must be corrected and does not add an incomplete
   timeline item.
3. **Given** a sales representative does not have access to a lead, **When** they try to view or add
   an activity for that lead, **Then** access is denied without exposing lead or activity details.

---

### User Story 2 - Manage follow-up work (Priority: P2)

Sales representatives and managers need open follow-up activities to be visible, assignable, and
completable so upcoming sales work does not get lost after calls, meetings, or exhibition
conversations.

**Why this priority**: Follow-up work turns the activity timeline from a passive history into an
operational sales tool.

**Independent Test**: A user can create a planned follow-up for an accessible lead, assign an owner
and due date, filter for open or overdue follow-ups, and mark the follow-up complete with an
outcome.

**Acceptance Scenarios**:

1. **Given** an accessible lead, **When** a user schedules a follow-up with an owner and due date,
   **Then** the follow-up is visible as open work on the lead and activities workspace.
2. **Given** an open follow-up reaches its due date without completion, **When** a permitted user
   reviews activity work, **Then** the follow-up is clearly identified as due or overdue.
3. **Given** an open follow-up, **When** its owner records the outcome, **Then** the follow-up is
   marked complete and remains visible in the lead's activity history.

---

### User Story 3 - Review team activity history (Priority: P3)

Managers need to review recent team activity across permitted leads so they can understand
follow-up discipline, identify stale opportunities, and coach representatives without requesting
manual updates.

**Why this priority**: Team review improves sales visibility, but it depends on activity capture
and follow-up management being available first.

**Independent Test**: A manager can open the activities workspace, filter activity history by team
scope, owner, activity type, status, and due state, and navigate from an activity to its related
lead when permitted.

**Acceptance Scenarios**:

1. **Given** a manager has access to a team scope, **When** they open the activities workspace,
   **Then** they see activity and follow-up records only for leads within their permitted scope.
2. **Given** a manager filters by owner and overdue status, **When** matching activities exist,
   **Then** the workspace shows only matching records with enough context to support follow-up
   review.
3. **Given** a manager selects an activity tied to a lead they may view, **When** they choose to
   inspect the related lead, **Then** they can navigate to the lead without losing activity context.

### Edge Cases

- When an activity is created for a lead that is archived, the system must prevent new planned
  follow-ups unless a permitted user first restores or reopens the lead.
- When two users update the same planned follow-up at nearly the same time, the system must prevent
  one user's completion or reassignment from silently overwriting the other user's change.
- When a due date is in the past, the system must allow it only for recording historical completed
  work and must clearly label planned work as overdue.
- When optional notes contain sensitive credential, payment, or private personal data, users must
  be warned to avoid storing that information.
- When activity history is large, users must be able to continue reviewing older records without
  losing filters or current context.

## CRM & Security Considerations *(mandatory)*

- **Business Capability**: Activities timeline for lead follow-up, sales interaction history, and
  team activity review.
- **Affected CRM Data**: Lead, Activity, Follow-up, Exhibition reference context when already
  associated with a lead, user ownership, team scope, notes, and audit metadata.
- **Roles & Permissions**: Admins may view and manage activities across the workspace. Managers may
  view and manage activities for permitted teams and leads. Sales Representatives may view and
  manage activities for leads assigned to them or otherwise permitted by existing lead access rules.
  Denied users must receive a safe denial response that does not reveal restricted lead or activity
  details.
- **Audit & Activity Trail**: Creating, completing, reassigning, editing allowed follow-up fields,
  and deleting or canceling planned activities must produce a security-relevant audit record. The
  lead activity timeline itself must preserve completed customer-facing activity history and show
  who recorded each item and when it was recorded.
- **Domain Events**: The feature must emit business events for activity created, follow-up
  scheduled, follow-up completed, follow-up reassigned, and activity canceled so later notification,
  analytics, and reporting capabilities can react without changing this user flow.
- **Security Controls**: Activity input must be validated before it is accepted. Activity text must
  not expose secrets, credentials, payment details, or hidden system information. Activity records
  must remain protected by the same session, role, ownership, and team-scope controls as the related
  lead. User-facing errors must be safe and actionable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow permitted users to add a completed activity to an accessible lead
  with activity type, activity time, owner, outcome, and optional note.
- **FR-002**: System MUST allow permitted users to schedule a planned follow-up for an accessible
  lead with owner, due date, activity type, and optional preparation note.
- **FR-003**: System MUST require either a completed activity outcome or a planned follow-up due
  date before an activity record can be saved.
- **FR-004**: System MUST show lead activities in a timeline that separates completed history from
  open planned follow-ups while preserving chronological context.
- **FR-005**: Users MUST be able to filter the activities workspace by activity type, owner, lead,
  status, due state, team scope, and date range when those filters are relevant to their permitted
  data.
- **FR-006**: System MUST clearly identify open, due today, overdue, completed, and canceled
  activities.
- **FR-007**: System MUST allow permitted users to complete an open follow-up by recording an
  outcome and completion time.
- **FR-008**: System MUST allow permitted users to reassign an open follow-up to another eligible
  owner when the reassignment stays within permitted lead and team scope.
- **FR-009**: System MUST prevent users from creating, viewing, completing, or reassigning
  activities for leads outside their permitted access.
- **FR-010**: System MUST preserve completed activity history after creation, allowing only clearly
  audited corrections that do not hide the original recorder, original time, or correction history.
- **FR-011**: System MUST allow permitted users to cancel planned activities that are no longer
  needed while keeping a visible record that the planned activity was canceled.
- **FR-012**: System MUST show enough context in activity lists for users to identify the related
  lead, owner, activity type, status, due date or activity time, and latest outcome without opening
  every record.
- **FR-013**: System MUST keep activity notes separate from security audit details and must not
  expose audit metadata to users who do not have permission to view it.
- **FR-014**: System MUST provide safe empty, loading, validation, denied-access, and unavailable
  states for the activities workspace and lead timeline sections.
- **FR-015**: System MUST make the activities workspace and timeline usable by keyboard and assistive
  technology users for the primary create, filter, complete, and review flows.

### Key Entities

- **Activity**: A customer-facing sales interaction or planned follow-up associated with a lead. Key
  attributes include activity type, status, owner, related lead, activity time or due date, outcome,
  note, recorder, and creation time.
- **Follow-up**: A planned activity that remains open until completed or canceled. Key attributes
  include owner, due date, due state, completion outcome, reassignment history, and cancellation
  reason when applicable.
- **Activity Timeline Entry**: A chronological item shown on a lead that represents completed
  activities, open follow-ups, cancellations, and audited corrections visible to permitted users.
- **Activity Filter**: A saved or current review context used to narrow activity lists by owner,
  status, type, date range, team scope, and due state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A sales representative can record a completed lead activity in under 90 seconds after
  opening an accessible lead.
- **SC-002**: A sales representative can schedule a follow-up from an accessible lead in under 60
  seconds.
- **SC-003**: Managers can identify overdue follow-ups for their permitted team scope in under 30
  seconds from the activities workspace.
- **SC-004**: At least 95% of activity list reviews show permitted users only records they are
  authorized to see, with denied records hidden or safely denied.
- **SC-005**: Users can filter activity history by owner, status, type, and date range with visible
  results or an empty state in under 3 seconds for normal workspace usage.
- **SC-006**: Keyboard-only users can complete the primary create, filter, and complete-follow-up
  flows without blocked controls or lost focus.

## Assumptions

- Phase 3 builds on the existing protected CRM workspace, user roles, team scope, lead ownership,
  and lead access behavior.
- Activities are initially tied to leads. Direct activity timelines for deals, exhibitions, and
  accounts are outside this phase unless those records are already represented through the related
  lead.
- Calendar synchronization, external email capture, call recording, file attachments, notifications,
  analytics dashboards, and automation rules are outside this phase.
- Activity notes are business notes for sales context, not a place to store credentials, payment
  details, private documents, or regulated sensitive data.
- English copy is required for this phase while layouts should remain suitable for future
  right-to-left language support.
