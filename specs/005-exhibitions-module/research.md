# Research: Exhibitions Module

## Decision: Create a dedicated Exhibitions module

**Rationale**: Phase 4 introduces first-class event records, attendance, attribution, summaries,
audit, and domain events. A dedicated module keeps Exhibition as its own aggregate while reusing
lead access, team scope, users, activities, and audit/event infrastructure through explicit service
dependencies.

**Alternatives considered**:

- Extend Leads Core only: rejected because attendance and performance summaries are exhibition-led,
  not lead-led.
- Place exhibitions under Activities: rejected because activities reference event context but do not
  own event planning, attendance, or attribution.

## Decision: Preserve lightweight lead exhibition references during reconciliation

**Rationale**: Phase 2 stored name/date/location references before full exhibitions existed. Phase 4
must link those leads to full exhibition records without deleting original attribution evidence. This
supports auditability, correction history, and later analytics consistency.

**Alternatives considered**:

- Replace lightweight references during link: rejected because original attribution context would be
  lost.
- Require perfect automatic matching: rejected because partial names, dates, and locations may
  match multiple events and require user review.

## Decision: Use scoped summaries, not revenue ROI dashboards

**Rationale**: The Phase 4 plan includes exhibition analytics and performance tracking, while the
master roadmap places exhibition ROI under executive analytics and revenue phases. Phase 4 should
summarize attributed lead count, lead status distribution, attendance, open follow-ups, overdue
follow-ups, and recent activity indicators without calculating revenue ROI or commission outcomes.

**Alternatives considered**:

- Include full ROI calculations now: rejected because deals, revenue, targets, and commissions are
  later phases.
- Skip summaries entirely: rejected because performance tracking is an explicit Phase 4 goal.

## Decision: Treat attendance and attribution as append-only history with audited corrections

**Rationale**: Attendance and attribution affect accountability, performance review, and future
commission/ROI calculations. Silent overwrites would undermine auditability and coaching value.
Corrections are allowed only with actor, timestamp, reason where provided, and retained prior state.

**Alternatives considered**:

- Make attendee and attribution rows freely editable: rejected because prior operational state would
  be untraceable.
- Make records immutable with no corrections: rejected because event planning and attribution errors
  are common and need a controlled correction path.

## Decision: Enforce role plus team/attendee/lead scope

**Rationale**: Exhibitions span teams, representatives, and attributed leads. Admins need global
management, managers need team-scoped management, and sales representatives need limited visibility
through attendee participation or permitted leads. Denial paths must avoid revealing cross-team lead
or attendee details.

**Alternatives considered**:

- Admin/manager-only visibility: rejected because representatives need event context and attendance
  confirmation.
- Lead-only scope: rejected because managers need exhibition planning and attendance review even
  before leads are created.

## Decision: No queue jobs in Phase 4

**Rationale**: Domain events are required for later notifications, analytics, automation, ROI, and
commission consumers. This phase records events with correlation and idempotency metadata but does
not deliver notifications or long-running jobs.

**Alternatives considered**:

- Add notification delivery now: rejected because the notifications engine is a later phase.
- Skip events until analytics: rejected because the constitution requires business state changes to
  emit explicit events when later consumers are expected.

## Decision: Use optimistic version checks for multi-user updates

**Rationale**: Exhibition planning, attendee assignment, and lead attribution can be changed by
multiple managers. Version checks prevent silent overwrites and align with existing stale-update
behavior in leads and activities.

**Alternatives considered**:

- Last-write-wins updates: rejected because it can overwrite attendee and attribution history.
- Full record locking: rejected because it adds operational complexity and is unnecessary for normal
  CRM editing frequency.
