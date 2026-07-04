# Implementation Plan: Exhibitions Module

**Branch**: `006-exhibitions-module` | **Date**: 2026-06-02 | **Spec**:
[spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-exhibitions-module/spec.md`

## Summary

Deliver Phase 4 Exhibitions Module as a protected CRM capability for managing exhibition records,
representative attendance, lead attribution, and event performance review. The implementation builds
on Users/RBAC, Leads Core, and Activities Timeline with persisted exhibition records, attendee and
attribution history, team-scoped access, audit records, domain events for later analytics and
notifications, and responsive protected workspace screens for exhibition list/detail, attendance,
attribution, and summary workflows.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: NestJS/Fastify API, Prisma ORM, PostgreSQL, existing internal event bus,
Next.js App Router, React, TanStack Query, Tailwind CSS, lucide-react, Zod, existing auth/session,
RBAC, users, teams, leads, and activities modules

**Storage**: PostgreSQL via Prisma. Add persisted exhibitions, attendee records, lead attribution
records, exhibition history, domain event records, indexes for list/detail/filter/summary paths, and
transaction boundaries for multi-step attendance and attribution changes. Redis/BullMQ remains
available for future retryable notification work, but this feature emits internal domain events only
and does not introduce queue jobs.

**Testing**: Vitest unit tests for schemas, lifecycle rules, permissions, attribution rules,
attendance eligibility, summary calculations, and UI validation; API contract tests for exhibition
endpoints; integration tests for create/update/archive/restore, attendance assignment and
confirmation, lead attribution and reconciliation, access denial, stale updates, audit logs, and
events; Playwright tests for protected exhibitions workspace, detail summary, attendance,
attribution, filters, keyboard access, and safe states; existing root CI verification.

**Target Platform**: Browser-based CRM workspace with protected API services running in the existing
Docker/local and CI environments.

**Project Type**: Full-stack web application capability within the existing monorepo.

**Performance Goals**: Managers can create exhibitions within 2 minutes, assign five attendees
within 2 minutes, link accessible leads within 60 seconds, identify event performance indicators
within 30 seconds from detail view, and see filtered exhibition results or an empty state within 3
seconds for normal workspace usage.

**Constraints**: Protected content remains default-deny; all exhibition reads and writes must
enforce role, ownership, attendee, lead, and team scope; attendance and attribution history must be
append-only except for audited corrections; notes must not expose secrets, credentials, payment
data, private documents, or hidden audit metadata; no full revenue ROI, commission, executive
analytics, notifications, import/export, AI scoring, or mobile-specific workflows in this phase; UI
must remain responsive, keyboard usable, and suitable for future right-to-left support.

**Scale/Scope**: Exhibition workspace and detail workflows for event management, attendance, lead
attribution, lightweight reference reconciliation, and scoped performance summaries. Excludes deal
creation, revenue attribution, target calculations, commission engine, executive ROI dashboards,
notification delivery, bulk import/export, AI scoring, and mobile-specific experiences.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **CRM capability boundary**: PASS. The single capability is Exhibitions Module for event
  management, attendance, lead attribution, and performance review. Affected aggregates are
  Exhibition, Lead, Activity/Follow-up summaries, User ownership, Team scope, audit records, and
  future Analytics/Notification consumers through domain events. Deals, revenue, targets,
  commissions, executive analytics, AI, import/export, and mobile-specific workflows remain out of
  scope.
- **Secure access control**: PASS. Admins may manage exhibitions across the workspace. Managers are
  scoped to permitted teams/exhibitions/leads. Sales Representatives may view permitted exhibitions
  and lead attribution through attendee, owned-lead, or explicit team scope and may confirm their
  own attendance when allowed. API boundaries must enforce permission checks for create/read/update/
  archive/restore/assign-attendee/confirm-attendance/attribute-lead/correct-attribution operations.
  Denials must not reveal restricted leads, attendees, or exhibition details. Inputs are validated
  for dates, status, owner eligibility, attendee eligibility, attribution scope, note length, stale
  versions, and sensitive text.
- **Test-first coverage**: PASS. Required tests include contract coverage for exhibition endpoints;
  integration coverage for RBAC denial, team scope, create/update/archive/restore, attendance
  assignment/confirmation/correction, lead attribution/reconciliation/correction, stale update
  prevention, audit records, and domain events; unit coverage for validation, lifecycle, attendance,
  attribution, summaries, and permission helpers; browser coverage for exhibition workspace,
  filters, detail summary, attendance, attribution, empty/error/denied states, and keyboard flows.
- **Auditable events**: PASS. ExhibitionCreated, ExhibitionUpdated, ExhibitionStatusChanged,
  ExhibitionAttendeeAssigned, ExhibitionAttendanceConfirmed, ExhibitionLeadAttributed, and
  ExhibitionAttributionCorrected events are required with correlation identifiers and typed,
  sanitized payloads. Security audit entries are required for create, update, status change,
  attendee changes, attendance confirmation, attribution changes, stale update rejection, and denied
  attempts. Attendance and attribution history remains append-only except through audited
  corrections.
- **Operational readiness**: PASS. Plan includes Prisma migration, indexes for event list/detail/
  filter/summary queries, transaction boundaries for multi-record attendance and attribution changes,
  structured logs with correlation IDs, safe error handling, exhibition count/latency metrics, no
  queue jobs in this phase, and deployment via existing CI/build flows.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
preserve the capability boundary, document access controls, define audit/domain events, include
migration/index/transaction considerations, and keep revenue ROI, notifications, import/export, AI,
and mobile workflows out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/005-exhibitions-module/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- exhibitions-api.yaml
|   `-- exhibitions-ui.md
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
|           |-- exhibitions/
|           |   |-- exhibition-audit.service.ts
|           |   |-- exhibition-event.service.ts
|           |   |-- exhibition.repository.ts
|           |   |-- exhibition.service.ts
|           |   `-- exhibitions.controller.ts
|           |-- leads/
|           |   |-- permissions/
|           |   `-- leads.module.ts
|           `-- users/
|-- web/
|   |-- app/
|   |   `-- (protected)/
|   |       |-- exhibitions/
|   |       |   |-- page.tsx
|   |       |   `-- [exhibitionId]/
|   |       |       `-- page.tsx
|   |       `-- leads/
|   |           `-- [leadId]/
|   |               `-- page.tsx
|   |-- features/
|   |   |-- exhibitions/
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

**Structure Decision**: Implement the capability inside the existing API/web monorepo. The API gets
a dedicated `modules/exhibitions` boundary because Phase 4 introduces a first-class Exhibition
aggregate while integrating with leads, users, teams, activities, audit, and events through existing
service contracts. The web gets a dedicated `features/exhibitions` area and replaces the protected
exhibitions placeholder with working list/detail workflows. Lead detail receives only scoped
exhibition-attribution context.

## Complexity Tracking

No constitution violations identified. No exception is required.
