# Implementation Plan: Activities Timeline

**Branch**: `005-activities-timeline` | **Date**: 2026-06-01 | **Spec**:
[spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-activities-timeline/spec.md`

## Summary

Deliver Phase 3 Activities Timeline as a protected CRM capability for recording completed lead
activities, scheduling and completing follow-ups, and reviewing team activity history. The
implementation extends the existing Leads Core and Users/RBAC foundation with persisted activity
records, team/ownership-scoped access, audited state changes, domain events for future
notifications/analytics, and responsive protected workspace screens for lead-level timelines and
cross-lead activity review.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: NestJS/Fastify API, Prisma ORM, PostgreSQL, existing internal event bus,
Next.js App Router, React, TanStack Query, Tailwind CSS, lucide-react, Zod, existing auth/session,
RBAC, users, teams, and leads modules

**Storage**: PostgreSQL via Prisma. Add persisted activity/follow-up records, activity correction
history, indexes for lead timeline and workspace filters, and transaction boundaries for multi-step
state changes. Redis/BullMQ remains available for future retryable notification work, but this
feature emits internal domain events only and does not introduce queue jobs.

**Testing**: Vitest unit tests for schemas, state transitions, permissions, due-state logic, event
payloads, and UI validation; API contract tests for activity endpoints; integration tests for
create, schedule, complete, reassign, cancel, access denial, audit logs, and events; Playwright tests
for protected lead timeline and activities workspace flows, filters, keyboard access, and safe
states; existing root CI verification.

**Target Platform**: Browser-based CRM workspace with protected API services running in the existing
Docker/local and CI environments.

**Project Type**: Full-stack web application capability within the existing monorepo.

**Performance Goals**: Users can create completed activities within 90 seconds from an accessible
lead, schedule follow-ups within 60 seconds, identify overdue team follow-ups within 30 seconds from
the activities workspace, and see filtered activity results or an empty state within 3 seconds for
normal workspace usage.

**Constraints**: Protected content remains default-deny; all activity reads and writes must enforce
lead access, ownership, and team scope; completed activity history must be append-only except for
audited corrections; notes must not expose secrets, credentials, payment data, or hidden system
metadata; no external calendar/email/call recording/attachment/notification/analytics automation in
this phase; UI must remain responsive, keyboard usable, and suitable for future right-to-left
support.

**Scale/Scope**: Lead-level timeline and cross-lead activities workspace for completed activities
and planned follow-ups. Includes activity creation, follow-up scheduling, completion, reassignment,
cancellation, filtering, audit/event emission, and safe states. Excludes deal/exhibition/account
activity timelines unless represented through related leads, external integrations, file
attachments, and notification delivery.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. The single capability is Activities Timeline for Lead and
  Follow-up operations. Affected aggregates are Lead, Activity, Follow-up, User ownership, Team
  scope, audit records, and future Notification/Analytics consumers through domain events. Deals,
  revenue, targets, and exhibitions are not modified except for existing lead context.
- **Secure access control**: PASS. Admins may manage activities across the workspace. Managers are
  scoped to permitted teams/leads. Sales Representatives are scoped to assigned or otherwise
  permitted leads. API boundaries must enforce permission checks for create/read/complete/reassign/
  cancel/correct operations. Denials must not reveal restricted lead or activity details. Inputs are
  validated for type, dates, owner eligibility, note length, status transitions, and stale updates.
- **Test-first coverage**: PASS. Required tests include contract coverage for all activity
  endpoints; integration coverage for RBAC denial, team scope, create/schedule/complete/reassign/
  cancel, archived-lead restrictions, stale update prevention, audit records, and domain events;
  unit coverage for validation/state transitions/due states/permission helpers; browser coverage for
  lead timeline, activities workspace filters, empty/error/denied states, and keyboard flows.
- **Auditable events**: PASS. ActivityCreated, FollowUpScheduled, FollowUpCompleted,
  FollowUpReassigned, ActivityCanceled, and ActivityCorrected events are required with correlation
  identifiers and typed payloads. Security audit entries are required for create, complete, reassign,
  cancel, correction, and denied attempts. Completed activity history remains append-only; planned
  follow-ups preserve cancellation/completion history.
- **Operational readiness**: PASS. Plan includes Prisma migration, indexes for timeline and filter
  queries, transaction boundaries for state changes, structured logs with correlation IDs, safe
  error handling, activity count/latency metrics, no queue jobs in this phase, and deployment via
  existing CI/build flows.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
preserve the capability boundary, document access controls, define audit/domain events, include
migration/index/transaction considerations, and keep external integrations out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/004-activities-timeline/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- activities-api.yaml
|   `-- activities-ui.md
|-- checklists/
|   `-- requirements.md
`-- spec.md
```

### Source Code (repository root)

```text
apps/
|-- api/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- migrations/
|   `-- src/
|       `-- modules/
|           |-- leads/
|           |   |-- activities/
|           |   |   |-- activity-audit.service.ts
|           |   |   |-- activity-event.service.ts
|           |   |   |-- activity.repository.ts
|           |   |   |-- activity.service.ts
|           |   |   `-- activities.controller.ts
|           |   |-- permissions/
|           |   `-- leads.module.ts
|           `-- users/
|-- web/
|   |-- app/
|   |   `-- (protected)/
|   |       |-- activities/
|   |       |   `-- page.tsx
|   |       `-- leads/
|   |           |-- page.tsx
|   |           `-- [leadId]/
|   |               `-- page.tsx
|   |-- features/
|   |   |-- activities/
|   |   |   |-- api/
|   |   |   |-- components/
|   |   |   |-- hooks/
|   |   |   `-- validation/
|   |   |-- leads/
|   |   `-- workspace/
|   `-- tests/
|       |-- e2e/
|       `-- frontend-shell/
packages/
|-- contracts/
`-- test-utils/
```

**Structure Decision**: Implement the capability inside the existing API/web monorepo. The API
activity module lives under `modules/leads` because activities are lead-scoped in Phase 3 and must
reuse lead access rules. The web gets a dedicated `features/activities` area while adding
lead-detail timeline components to the existing leads feature. Contracts remain in the feature spec
folder and will later be reflected in the shared OpenAPI contract.

## Complexity Tracking

No constitution violations identified. No exception is required.
