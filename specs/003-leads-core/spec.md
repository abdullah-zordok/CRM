# Feature Specification: Leads Core

**Feature Branch**: `003-leads-core`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "create Phase 2 - Leads Core from Plan.md"

## Clarifications

### Session 2026-06-01

- Q: How should duplicate leads be handled when matching contact details exist outside the user's visible scope? -> A: Block platform-wide active duplicates with privacy-safe messaging.
- Q: What lead status transition model should Phase 2 enforce? -> A: Forward flow with Admin/Manager correction and archival.
- Q: How should Phase 2 represent exhibition relationships before the Exhibitions Module exists? -> A: Lightweight exhibition reference with name, date, and location.
- Q: What active-lead scale target should Phase 2 validate for search, filtering, and list workflows? -> A: Up to 10,000 active leads.
- Q: How should Phase 2 handle concurrent edits to the same lead? -> A: Reject stale updates and ask the user to reload the latest lead.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create And Capture Leads (Priority: P1)

As a sales representative or manager, I need to create a lead with contact,
source, priority, budget, exhibition reference, assignment, and notes so the
sales team can start tracking a real opportunity from the first customer
interaction.

**Why this priority**: Lead creation is the first CRM business record and the
center of later activities, follow-ups, deals, revenue, analytics, and
notifications. Without reliable lead capture, later sales operations workflows
have no trusted starting point.

**Independent Test**: Can be tested by signing in as an authorized user,
creating a lead with required contact and source details, confirming the lead is
saved with an owner and initial status, and verifying unauthorized users cannot
view or create leads outside their permitted scope.

**Acceptance Scenarios**:

1. **Given** an authorized user has valid lead details, **When** they submit the
   lead, **Then** the lead is created with a unique identifier, owner, source,
   status, priority, and creation audit trail.
2. **Given** required lead fields are missing or invalid, **When** the user
   submits the lead, **Then** the lead is not created and the user receives clear
   field-level guidance without sensitive system details.
3. **Given** a lead appears to duplicate an existing reachable lead by contact
   details, **When** the user attempts creation, **Then** the system blocks the
   duplicate, directs the user to the existing lead when permitted, and preserves
   the existing lead.
4. **Given** a Sales Representative creates a lead, **When** the lead is saved,
   **Then** that representative becomes the owner unless an authorized Manager
   or Admin assigns it to another permitted user.

---

### User Story 2 - Assign And Work Leads (Priority: P1)

As a manager or administrator, I need to assign and reassign leads within
permitted teams so work is owned by the right sales representative and managers
can keep the pipeline accountable.

**Why this priority**: Lead ownership drives accountability and access control.
Later follow-ups, activities, deals, targets, commissions, and analytics depend
on each lead having a clear owner and assignment history.

**Independent Test**: Can be tested by creating leads, assigning them to sales
representatives, reassigning them within manager scope, and confirming each role
can only view or modify leads allowed by ownership, team scope, and permission
rules.

**Acceptance Scenarios**:

1. **Given** a Manager has team-scoped assignment permission, **When** they
   assign an unassigned or team-visible lead to a Sales Representative in their
   team, **Then** the lead owner changes and assignment history is recorded.
2. **Given** a Sales Representative attempts to assign a lead to another user,
   **When** they submit the change, **Then** the system denies the action unless
   their role explicitly allows it.
3. **Given** an Admin reassigns a lead across teams, **When** the reassignment is
   saved, **Then** the new owner and team scope take effect immediately for
   future access decisions.
4. **Given** a disabled or inactive user is selected as an assignee, **When** the
   assignment is submitted, **Then** the system prevents the assignment and
   explains that the assignee is not eligible.

---

### User Story 3 - Track Lead Status And Pipeline (Priority: P2)

As a sales user, I need to move leads through a clear status and pipeline flow so
the organization can understand lead progress, backlog, and conversion readiness.

**Why this priority**: The CRM must show where leads stand before detailed
activity history and deal revenue workflows are introduced. Status tracking
provides operational visibility while keeping Phase 2 focused on lead core
records.

**Independent Test**: Can be tested by updating lead status through allowed
pipeline states, filtering leads by status and source, and confirming invalid or
unauthorized status changes are rejected and audited.

**Acceptance Scenarios**:

1. **Given** an authorized user owns or manages a lead, **When** they update the
   lead status to an allowed next state, **Then** the current status changes and
   the prior state remains traceable.
2. **Given** a user attempts an invalid status transition, **When** they submit
   the update, **Then** the system prevents the change and keeps the previous
   status.
3. **Given** an Admin or Manager needs to correct a mistaken active status,
   **When** they submit an allowed correction or archive action, **Then** the
   corrected status is saved and the correction remains traceable.
4. **Given** an authorized user filters the lead list by status, source,
   priority, assignee, or exhibition reference, **When** matching leads exist,
   **Then** the user sees only matching leads within their permitted scope.
5. **Given** a lead is converted into a later deal workflow, **When** Phase 2 is
   complete, **Then** the lead contains the minimum status and ownership history
   needed for Phase 5 to attach deal records without recreating the lead.

---

### User Story 4 - Add Lead Notes And Source Context (Priority: P2)

As an authorized sales user, I need to add lead notes and source context so
important customer information is retained before the full activities timeline is
introduced.

**Why this priority**: Phase 2 includes a notes system and source tracking, but
it should not absorb the full calls, meetings, visits, WhatsApp, and follow-up
timeline planned for Phase 3. A lightweight lead note history preserves context
without expanding scope.

**Independent Test**: Can be tested by adding notes to a lead, viewing the note
history from the lead detail, verifying notes are visible only to users with
lead access, and confirming note edits do not erase prior accountability.

**Acceptance Scenarios**:

1. **Given** an authorized user can access a lead, **When** they add a note,
   **Then** the note is attached to the lead with author, timestamp, and visible
   text.
2. **Given** a user lacks access to a lead, **When** they attempt to view or add
   notes, **Then** the system denies access and records the denied decision.
3. **Given** a lead comes from an exhibition or other source, **When** the lead
   is created or updated, **Then** the source and optional exhibition
   reference name, date, and location are visible on the lead record.
4. **Given** users need detailed calls, meetings, WhatsApp logs, visits, and
   follow-up history, **When** they review Phase 2, **Then** those activity types
   are identified as later timeline scope and not required for Leads Core.

### Edge Cases

- What happens when required contact details are missing, malformed, or
  duplicated against an existing lead?
- What happens when a submitted lead duplicates an active lead outside the
  user's visible scope without revealing restricted lead details?
- What happens when a user tries to create, view, update, assign, or note a lead
  outside their permitted ownership or team scope?
- What happens when a lead is assigned to a disabled, inactive, or removed user?
- What happens when a Manager tries to assign a lead outside their team scope?
- What happens when a lead source or exhibition reference is changed after
  the lead has already been worked?
- What happens when a lightweight exhibition reference is incomplete or later
  needs reconciliation with a full exhibition record?
- What happens when a user attempts to delete or overwrite lead notes that must
  remain traceable?
- What happens when the lead list has no matching results for a user's filters?
- What happens when authorized users search, filter, or sort a large active lead
  set up to the Phase 2 validation target?
- What happens when multiple users attempt to update the same lead status or
  assignment in close succession?
- What happens when a user submits changes based on an older lead version after
  another user has already saved newer changes?
- What happens when a user tries to move a lead backward in the pipeline without
  Admin or Manager correction permission?

## CRM & Security Considerations *(mandatory)*

- **Business Capability**: Lead management core for sales operations, including
  creation, assignment, status tracking, source tracking, exhibition
  reference, and lead notes.
- **Affected CRM Data**: Lead contact details, company details, source,
  lifecycle status, assignee, creator, priority, budget estimate, exhibition
  reference name, exhibition reference date, exhibition reference location, lead
  notes, assignment history, status history, and audit records. Phase 2 does not
  create follow-up, activity timeline, deal, revenue, target, commission,
  analytics, WhatsApp, notification, AI, or full exhibition management records.
- **Roles & Permissions**: Admin users can view and manage all leads and
  assignment rules. Managers can view and manage leads within their team scope
  and assign eligible team members. Sales Representatives can create leads, view
  and update leads they own or are explicitly permitted to access, and cannot
  grant themselves broader visibility. All protected lead actions deny by
  default when role, ownership, or team scope is missing.
- **Audit & Activity Trail**: Lead creation, contact update, status change,
  assignment change, source or exhibition change, note addition, duplicate
  handling, and denied access must produce traceable audit entries. Lead notes
  and lead history are append-only for normal users so business context cannot be
  silently erased.
- **Domain Events**: Lead creation, lead assignment, lead status change, lead
  source change, and lead note addition should emit stable business events for
  future notifications, analytics, follow-up automation, and integrations. Event
  handling must be idempotent for repeated submissions and include correlation
  identifiers for tracing.
- **Security Controls**: Lead inputs must be validated and sanitized. Customer
  contact details, budget estimates, notes, and audit metadata must be protected
  by least privilege. User-visible errors must not expose secrets, raw internal
  details, stack traces, or leads outside the user's allowed scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authorized users to create leads with required
  name or company context, at least one reachable contact method, source, status,
  owner or assignee, creator, and priority.
- **FR-002**: System MUST support optional lead email, phone, company, budget
  estimate, exhibition reference, and note fields when available.
- **FR-003**: System MUST validate lead contact, source, status, priority,
  budget, and assignment details before saving.
- **FR-004**: System MUST prevent users from creating or updating leads outside
  their role, ownership, or team scope.
- **FR-005**: System MUST detect likely duplicate leads using contact details and
  MUST block creation when any active lead already has the same email or phone
  number, while revealing existing lead details only when the user has permission
  to view that lead.
- **FR-006**: System MUST assign every lead an initial lifecycle status from the
  approved Phase 2 status set.
- **FR-007**: System MUST allow authorized users to update lead status only to
  allowed states and MUST preserve status history.
- **FR-007a**: System MUST define the Phase 2 status set as New, Contacted,
  Qualified, Negotiation, Won, Lost, and Archived.
- **FR-007b**: System MUST enforce the normal forward flow New to Contacted to
  Qualified to Negotiation to Won or Lost for Sales Representative status
  updates.
- **FR-007c**: System MUST allow Admins and Managers to correct active lead
  statuses backward or forward when the correction is recorded in lead history.
- **FR-007d**: System MUST allow Admins and Managers to archive leads and MUST
  prevent normal users from changing Archived leads unless an Admin or Manager
  restores the lead to an active status.
- **FR-008**: System MUST allow Admins to view, create, update, assign, and
  reassign leads across all teams.
- **FR-009**: System MUST allow Managers to view, create, update, assign, and
  reassign leads within their permitted team scope.
- **FR-010**: System MUST allow Sales Representatives to create leads and view or
  update leads they own or are explicitly permitted to access.
- **FR-011**: System MUST prevent Sales Representatives from assigning leads to
  other users in Phase 2.
- **FR-012**: System MUST prevent assignment to disabled, inactive, or otherwise
  ineligible users.
- **FR-013**: System MUST apply assignment changes immediately to future lead
  visibility and update permissions.
- **FR-014**: System MUST preserve assignment history, including prior assignee,
  new assignee, actor, timestamp, and reason when provided.
- **FR-015**: System MUST allow authorized users to search, filter, and sort
  leads by contact or company text, status, source, priority, assignee, creator,
  team scope, exhibition reference, and creation or update date.
- **FR-015a**: System MUST keep lead search, filtering, sorting, and list
  navigation usable for up to 10,000 active leads in Phase 2 validation.
- **FR-016**: System MUST ensure lead lists and lead details show only records
  inside the user's permitted role, ownership, or team scope.
- **FR-017**: System MUST support a controlled list of lead sources and record
  the source selected for each lead.
- **FR-018**: System MUST allow a lead to store a lightweight exhibition
  reference with exhibition name, date, and location when the lead originated
  from an exhibition, without requiring the full exhibitions module to be
  complete.
- **FR-018a**: System MUST preserve lightweight exhibition reference history when
  the reference changes, so later exhibition reconciliation can distinguish
  original attribution from corrections.
- **FR-019**: System MUST allow authorized users to add append-only lead notes
  with author, timestamp, and note content.
- **FR-020**: System MUST prevent normal users from silently deleting or
  overwriting lead notes and history.
- **FR-021**: System MUST record audit entries for lead creation, contact
  updates, status changes, assignment changes, source or exhibition changes,
  note additions, duplicate handling, and denied lead access.
- **FR-022**: System MUST emit traceable business events for lead creation,
  assignment, status change, source change, and note addition.
- **FR-023**: System MUST expose clear empty, loading, validation, duplicate,
  permission-denied, and conflict states for lead workflows.
- **FR-023a**: System MUST reject stale lead updates when another user has saved
  a newer lead version first, and MUST ask the user to reload the latest lead
  before retrying.
- **FR-024**: System MUST keep Phase 2 limited to Leads Core and MUST NOT
  implement full activities timeline, calls, meetings, WhatsApp logs,
  follow-up scheduling, deals, revenue, commissions, targets, executive
  analytics, notifications, AI scoring, or mobile-specific workflows.

### Key Entities *(include if feature involves data)*

- **Lead**: The central CRM record for a potential customer or opportunity;
  includes contact details, company context, source, lifecycle status, owner,
  creator, priority, budget estimate, timestamps, and current visibility scope.
- **Lead Source**: The origin of a lead, such as exhibition, referral, website,
  inbound inquiry, manual entry, or other approved source.
- **Lead Status**: The current pipeline state for a lead, such as new,
  contacted, qualified, negotiation, won, lost, or archived according to the
  approved Phase 2 status set.
- **Lead Assignment**: The relationship between a lead and its current owner or
  assignee, including assignment history and the actor who made each change.
- **Exhibition Reference**: Optional lightweight lead attribution containing
  exhibition name, date, and location for later reconciliation with the full
  exhibitions module.
- **Lead Note**: An append-only note attached to a lead with author, timestamp,
  and content; it preserves early sales context before the full activity
  timeline feature exists.
- **Lead History Entry**: A traceable record of status, assignment, source,
  exhibition, duplicate, or note changes relevant to a lead.
- **Lead Access Decision**: The allow or deny result for a protected lead action
  based on role, ownership, team scope, user status, and requested operation.
- **Lead Domain Event**: A stable business event emitted when lead state changes
  in a way that future notifications, analytics, automation, or integrations may
  need.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An authorized user can create a complete lead with required
  contact, source, status, priority, owner, and optional note details in under 2
  minutes during acceptance testing.
- **SC-002**: 100% of protected lead create, view, update, assign, note, and
  status-change actions enforce role, ownership, and team-scope rules.
- **SC-003**: 100% of lead creation attempts with missing required fields or
  invalid contact details are rejected with actionable field-level guidance.
- **SC-004**: 95% of lead searches and filters show matching in-scope results
  within 2 seconds in a normal local validation environment.
- **SC-004a**: Lead list validation supports up to 10,000 active leads while
  preserving role, ownership, and team-scope filtering.
- **SC-005**: 100% of assignment changes immediately affect future lead
  visibility and update permissions during acceptance testing.
- **SC-005a**: 100% of status-change acceptance tests enforce the Phase 2
  forward flow for Sales Representatives and allow only Admin or Manager
  correction or archival paths outside that flow.
- **SC-006**: Audit validation confirms that 100% of lead creation, assignment,
  status change, source or exhibition change, note addition, duplicate handling,
  and denied-access actions produce traceable audit entries.
- **SC-007**: Reviewers can identify the current owner, status, source,
  priority, notes, exhibition reference, assignment history, and status history
  for a lead within 30 seconds from the lead detail workflow.
- **SC-008**: Duplicate-lead acceptance tests block 100% of duplicate attempts
  using matching email or phone details across all active leads, with restricted
  matches returning privacy-safe guidance rather than restricted lead details.
- **SC-008a**: Concurrent-edit acceptance tests reject 100% of stale lead update
  submissions and preserve the newest saved lead version.
- **SC-009**: Reviewers can identify Phase 2 boundaries and excluded later
  modules within 5 minutes of reading the specification.

## Assumptions

- Phase 2 builds on Phase 0 foundation behavior and Phase 1 Users & RBAC,
  including authenticated access, Admin, Manager, and Sales Representative roles,
  one active team per user, default-deny permissions, session revocation, and
  security audit review.
- The approved Phase 2 lead fields come from the master plan: name, phone,
  email, company, source, status, assigned user, event or exhibition reference,
  creator, priority, budget, and notes.
- Phase 2 validation targets up to 10,000 active leads; higher-volume import,
  export, archival, and advanced reporting requirements are deferred until later
  operational or analytics phases.
- The initial lead source list may include exhibition, referral, website,
  inbound inquiry, manual entry, and other approved business sources; exact
  labels can be refined during planning without changing the feature scope.
- The initial lead status set is limited to states needed for core pipeline
  visibility: New, Contacted, Qualified, Negotiation, Won, Lost, and Archived.
  Detailed follow-up scheduling and full activity types are deferred to later
  phases.
- Exhibition references are stored as optional lightweight lead attribution in
  Phase 2 using name, date, and location; full exhibition management and
  exhibition analytics are deferred to the exhibitions module.
- Lead notes are append-only for normal workflows to preserve accountability.
  Formal redaction or compliance deletion, if required, is outside normal Phase
  2 user workflows.
- Deals, revenue, targets, commissions, executive analytics, notifications,
  WhatsApp integration, AI scoring, and mobile-specific experiences remain out
  of scope for Phase 2.
