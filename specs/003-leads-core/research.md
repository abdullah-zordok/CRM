# Research: Leads Core

## Decision: Use a dedicated Leads module inside the existing modular monolith

**Rationale**: Lead management is the central CRM aggregate and has its own
validation, permissions, status flow, duplicate detection, history, notes,
events, and contracts. A dedicated module keeps the boundary clear while reusing
Phase 1 users, roles, team scope, audit, and session behavior.

**Alternatives considered**:
- Extend the Users module: rejected because lead workflows are business records,
  not identity administration.
- Create a separate leads service: rejected because the constitution and prior
  plans standardize on a modular monolith until a real scaling boundary exists.

## Decision: Store leads and their histories in PostgreSQL through Prisma-backed persistence

**Rationale**: Leads, assignments, notes, duplicate checks, audit records, and
status history require transactional integrity, relational ownership/team
queries, repeatable migrations, and indexes for search/filter paths up to 10,000
active leads.

**Alternatives considered**:
- Store lead notes or history in document blobs: rejected because append-only
  history, audit review, and targeted filtering need queryable records.
- Use Redis as lead storage: rejected because Redis is queue/cache
  infrastructure, not the source of truth for CRM business data.

## Decision: Enforce platform-wide active duplicate blocking with privacy-safe restricted-match behavior

**Rationale**: Contact-level duplicates damage lead ownership, follow-up
accountability, and later conversion analytics. Platform-wide blocking prevents
duplicates across teams, while privacy-safe messages avoid revealing restricted
lead details to users who cannot see the existing lead.

**Alternatives considered**:
- Check only visible leads: rejected because it allows duplicate active leads
  across teams.
- Allow duplicates after warning: rejected because it weakens data quality and
  later analytics.

## Decision: Use a constrained forward status flow with Admin/Manager correction and archival

**Rationale**: Sales Representatives need a predictable pipeline path while
Managers and Admins need a controlled way to correct mistakes. Recording
corrections and archive/restore actions preserves accountability without
overcomplicating Phase 2.

**Alternatives considered**:
- Any active status can move to any active status: rejected because it reduces
  pipeline consistency.
- Strict next-step-only transitions for all users: rejected because operational
  corrections would become too costly.

## Decision: Model lightweight exhibition references in Phase 2

**Rationale**: The master roadmap makes exhibition attribution important, but
the full Exhibitions Module is Phase 4. Capturing name, date, and location on
the lead preserves attribution now and allows later reconciliation without
pulling exhibition management into Phase 2.

**Alternatives considered**:
- Text-only lead source: rejected because it loses useful attribution detail.
- Require existing exhibition records: rejected because full exhibition records
  are out of scope until Phase 4.

## Decision: Keep lead notes append-only for normal workflows

**Rationale**: Notes are customer-facing sales context and must remain
accountable before the full activity timeline exists. Append-only notes avoid
silent edits and provide an easy bridge to later activity history.

**Alternatives considered**:
- Editable notes: rejected because edits can obscure what a user knew at the
  time.
- Defer all notes to Phase 3: rejected because Phase 2 explicitly includes a
  notes system.

## Decision: Reject stale updates instead of merging or locking

**Rationale**: Lead ownership, status, and notes are high-accountability fields.
Rejecting stale updates protects the newest saved version and gives users a
clear reload path. It is simpler than locking and safer than silent overwrites.

**Alternatives considered**:
- Last save wins: rejected because it can silently erase assignment or status
  changes.
- Field-level merge: rejected because conflict semantics become complex for
  notes, ownership, and status history in Phase 2.
- Edit locking: rejected because it adds coordination complexity without a
  proven need.

## Decision: Validate list/search behavior for up to 10,000 active leads

**Rationale**: The clarified spec sets 10,000 active leads as the Phase 2
validation target. This is large enough to force pagination, indexing, scoped
queries, and performance tests while keeping Phase 2 focused on core workflows.

**Alternatives considered**:
- 50,000 or 100,000 active leads: deferred until import/export, archival, and
  analytics phases define higher-volume operations.
- No explicit target: rejected because search/filter acceptance tests would be
  vague.

## Decision: Emit lead domain events for business state changes without adding notification jobs

**Rationale**: LeadCreated, LeadAssigned, LeadStatusChanged,
LeadSourceChanged, LeadExhibitionReferenceChanged, and LeadNoteAdded are
required signals for later notifications, analytics, automation, and
integrations. Phase 2 records and dispatches events with correlation identifiers
and idempotency, but does not add downstream notification or analytics jobs.

**Alternatives considered**:
- Skip domain events until notifications: rejected because the constitution
  requires business state changes to emit explicit events.
- Add notification jobs now: rejected because notifications are a later phase.
