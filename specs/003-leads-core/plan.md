# Implementation Plan: Leads Core

**Branch**: `003-leads-core` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-leads-core/spec.md`

## Summary

Deliver Phase 2 Leads Core for the Sales Operations CRM platform. The
implementation introduces the first CRM business aggregate: lead creation,
platform-wide active duplicate blocking with privacy-safe messaging, ownership
and team-scoped visibility, lead assignment and reassignment, status pipeline,
lightweight exhibition references, append-only lead notes, lead history,
auditable access decisions, and lead domain events. Phase 2 deliberately
excludes full activities timeline, follow-up scheduling, deals, revenue,
targets, commissions, analytics, notifications, WhatsApp, AI, bulk import/export,
and mobile-specific workflows.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: Next.js App Router, React, TanStack Query, Tailwind CSS,
shadcn/ui, NestJS, Fastify adapter, Prisma ORM, PostgreSQL, Redis, BullMQ,
Docker, GitHub Actions, Zod, pino-compatible structured logging, OpenAPI

**Storage**: PostgreSQL for leads, lead sources, lead assignments, lead status
history, lightweight exhibition references, lead notes, lead access decisions,
lead audit metadata, and lead event records; Redis for existing queue transport
where lead events later feed retryable jobs

**Testing**: Unit tests for lead validation, duplicate detection, status
transition rules, ownership/team-scope checks, stale update detection, note
append rules, event payload sanitization, and audit metadata; API contract tests
from OpenAPI; integration tests for lead create/update/list/detail, duplicate
blocking, assignment, status correction, archive/restore, notes, history,
permission denials, stale update conflicts, 10,000 active-lead search/filter
validation, migrations, and domain events; browser tests for protected lead list,
lead create/edit, assignment/status controls, notes, permission-denied states,
empty/loading/error states, and duplicate/conflict feedback

**Target Platform**: Browser web application plus server-side API running in
Linux containers

**Project Type**: Web application with separate frontend and backend apps in one
workspace

**Performance Goals**: Authorized users can create a complete lead in under 2
minutes; 95% of lead searches and filters display matching in-scope results
within 2 seconds in a normal local validation environment; lead detail shows
owner, status, source, exhibition reference, notes, assignment history, and
status history within 30 seconds; list/search validation supports up to 10,000
active leads

**Constraints**: Default-deny protected lead access; Admin global lead scope;
Manager team scope; Sales Representative owned/explicit lead scope; platform-wide
active duplicate blocking by email or phone with privacy-safe restricted-match
messages; normal Sales Representative status flow is New to Contacted to
Qualified to Negotiation to Won or Lost; Admin/Manager correction and archive
paths are audited; assignment to disabled or inactive users is blocked; lead
notes and lead history are append-only for normal workflows; stale updates are
rejected; user-visible errors redact restricted lead details, secrets, stack
traces, and raw internals

**Scale/Scope**: One Leads module, one protected lead management surface, lead
source seed data, Lead aggregate, LeadAssignment, LeadStatusHistory,
LeadExhibitionReference, LeadNote, LeadHistoryEntry, LeadAccessDecision,
LeadDomainEvent, OpenAPI contract, and focused verification path for 10,000
active leads

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. This feature delivers the single business
  capability "lead management core for sales operations." It introduces the Lead
  aggregate plus related source, assignment, status, lightweight exhibition
  reference, note, history, access decision, audit, and lead event records. It
  preserves relationships needed by future Activity, Follow-up, Deal, Revenue,
  Target, Exhibition, Analytics, and Notification features without implementing
  those later aggregates.
- **Secure access control**: PASS. Plan defines Admin global scope, Manager
  team scope, Sales Representative owned/explicit scope, default-deny behavior,
  permission checks for every protected lead action, validation, platform-wide
  duplicate blocking with privacy-safe restricted-match behavior, stale update
  rejection, safe errors, and protection for contact details, budget estimates,
  notes, and audit metadata.
- **Test-first coverage**: PASS. Planning requires unit, contract, integration,
  security-path, migration, performance-seeded, event, and browser tests before
  implementation tasks are accepted.
- **Auditable events**: PASS. Lead creation, contact updates, assignment
  changes, status changes, Admin/Manager corrections, archive/restore, source or
  exhibition reference changes, note additions, duplicate handling, stale update
  conflicts, and denied access produce audit records and lead domain events with
  correlation identifiers and idempotency protection.
- **Operational readiness**: PASS. Plan covers structured logs, metrics-worthy
  counters, safe error behavior, migrations, indexes, transaction boundaries,
  10,000 active-lead validation, stale update conflict handling, CI checks, and
  local container verification.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` preserve all gates without adding later activity, deal, revenue,
analytics, notification, WhatsApp, AI, import/export, or mobile scope.

## Project Structure

### Documentation (this feature)

```text
specs/003-leads-core/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
|-- checklists/
|   `-- requirements.md
`-- spec.md
```

### Source Code (repository root)

```text
apps/
|-- web/
|   |-- app/
|   |   `-- (protected)/
|   |       `-- leads/
|   |           |-- page.tsx
|   |           `-- [leadId]/
|   |               `-- page.tsx
|   |-- features/
|   |   `-- leads/
|   |       |-- api/
|   |       |-- components/
|   |       |-- hooks/
|   |       `-- validation/
|   `-- tests/
|       |-- e2e/
|       `-- leads/
|-- api/
|   |-- prisma/
|   |-- src/
|   |   |-- modules/
|   |   |   |-- leads/
|   |   |   |   |-- audit/
|   |   |   |   |-- events/
|   |   |   |   |-- notes/
|   |   |   |   |-- permissions/
|   |   |   |   |-- sources/
|   |   |   |   `-- status/
|   |   |   |-- users/
|   |   |   |-- auth/
|   |   |   `-- foundation/
|   |   |-- common/
|   |   |-- infrastructure/
|   |   `-- config/
|   `-- tests/
|       |-- contract/
|       |-- integration/
|       |-- unit/
|       `-- support/
packages/
|-- contracts/
|   `-- openapi.yaml
`-- test-utils/
    `-- src/
        |-- leads-core-contract.ts
        |-- leads-core-factories.ts
        `-- verify-leads-core.ts
```

**Structure Decision**: Continue the Phase 0/Phase 1 single workspace with
`apps/web` and `apps/api`. The backend remains a modular monolith and adds a
dedicated `leads` module that consumes Phase 1 users, roles, teams, sessions,
permissions, and audit services. The frontend adds protected lead management
surfaces inside the existing app instead of creating a separate sales app.

## Complexity Tracking

No constitution violations identified. No exception is required.
