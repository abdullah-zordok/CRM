# Implementation Plan: Foundation Architecture

**Branch**: `001-foundation-architecture` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-foundation-architecture/spec.md`

## Summary

Create the production-ready foundation for the Sales Operations CRM platform:
monorepo structure, web shell, API shell, minimal login/logout with seeded Admin,
baseline role checks, PostgreSQL persistence, Redis-backed smoke queue, event
bus readiness, structured audit/logging, health/readiness checks, Docker local
runtime, and CI quality pipeline. Phase 0 deliberately excludes full user
management, team hierarchy, CRM records, business dashboards, WhatsApp, AI, and
mobile-specific workflows.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: Next.js App Router, React, TanStack Query, Tailwind CSS,
shadcn/ui, NestJS, Fastify adapter, Prisma ORM, PostgreSQL, Redis, BullMQ, Docker,
GitHub Actions, Zod, pino-compatible structured logging, OpenAPI

**Storage**: PostgreSQL for minimal identity/auth/audit/event/job metadata;
Redis for queue transport and retry state

**Testing**: Unit tests for validation, auth, RBAC, audit/event/job behavior;
API contract tests from OpenAPI; integration tests for login/logout/protected
shell, health/readiness, migrations, seeded Admin, smoke event/job; Playwright
or equivalent browser smoke tests for the protected shell; CI verification for
build, tests, security checks, migrations, and container startup

**Target Platform**: Browser web application plus server-side API running in
Linux containers

**Project Type**: Web application with separate frontend and backend apps in one
workspace

**Performance Goals**: Foundation startup verification completes in under 15
minutes for a new developer; health/readiness checks return within 1 second in a
local environment; protected shell navigation completes within 3 seconds locally;
smoke job status is visible within 10 seconds under normal local conditions

**Constraints**: Default-deny protected access; no live CRM business records in
Phase 0; secrets only through environment variables; safe errors with no stack
traces or credentials in user-visible responses; retryable background work must
be idempotent; migrations must be repeatable in clean local environments

**Scale/Scope**: One web app, one API app, one PostgreSQL service, one Redis
service, one seeded Admin user, three baseline role categories, minimal auth
state, security audit records, one smoke event, one smoke background job, and one
CI quality pipeline

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. This feature delivers the single business
  capability "platform foundation for secure, spec-driven CRM delivery." It
  prepares future Lead, Activity, Follow-up, Deal, Revenue, Target, Exhibition,
  Analytics, and Notification aggregates but does not implement their business
  records or workflows.
- **Secure access control**: PASS. Phase 0 includes minimal login/logout,
  protected shell, seeded Admin, Admin/Manager/Sales Representative role
  categories, baseline role checks, default-deny behavior, validation, safe
  errors, environment-only secrets, and persisted security audit records.
- **Test-first coverage**: PASS. Planning requires unit, contract, integration,
  security-path, migration, queue, and browser smoke tests before implementation
  tasks are accepted.
- **Auditable events**: PASS. Phase 0 includes audit records for login, logout,
  denied access, startup/config failures where applicable, and a non-business
  smoke event/job with correlation identifiers, retry policy, idempotency, and
  observable status.
- **Operational readiness**: PASS. Plan covers structured logs, request
  correlation, health/readiness checks, smoke job visibility, Docker startup,
  migration verification, CI quality pipeline, and bounded performance targets.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` preserve all gates without adding later-phase CRM scope.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-architecture/
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
|   |-- components/
|   |-- features/foundation/
|   |-- lib/
|   `-- tests/
|-- api/
|   |-- prisma/
|   |-- src/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   `-- foundation/
|   |   |-- common/
|   |   |   |-- decorators/
|   |   |   |-- guards/
|   |   |   |-- interceptors/
|   |   |   |-- filters/
|   |   |   `-- validation/
|   |   |-- infrastructure/
|   |   |   |-- database/
|   |   |   |-- queues/
|   |   |   |-- cache/
|   |   |   |-- events/
|   |   |   `-- observability/
|   |   |-- config/
|   |   `-- main.ts
|   `-- tests/
packages/
|-- config/
|-- contracts/
`-- test-utils/
infra/
|-- docker/
`-- local/
.github/
`-- workflows/
```

**Structure Decision**: Use a single workspace with `apps/web` and `apps/api`
because Phase 0 must verify both the protected browser shell and backend
foundation while keeping shared configuration and contract files centralized.
The backend remains a modular monolith; no microservices are introduced.

## Complexity Tracking

No constitution violations identified. No exception is required.
