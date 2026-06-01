# Implementation Plan: Users & RBAC

**Branch**: `002-users-rbac` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-users-rbac/spec.md`

## Summary

Deliver Phase 1 secure user administration and role-based access control for the
Sales Operations CRM platform. The implementation extends the Phase 0 foundation
from a seeded Admin and baseline role categories into managed platform users,
fixed business roles, a permission matrix, one active team per user, secure
activation-based onboarding, immediate session revocation after access removal,
searchable security audit review, and contracts/tests for all protected paths.
The feature deliberately excludes CRM business records, custom roles, editable
role permissions, audit export, notification delivery, analytics dashboards,
WhatsApp, AI, and mobile-specific workflows.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: Next.js App Router, React, TanStack Query, Tailwind CSS,
shadcn/ui, NestJS, Fastify adapter, Prisma ORM, PostgreSQL, Redis, BullMQ,
Docker, GitHub Actions, Zod, pino-compatible structured logging, OpenAPI

**Storage**: PostgreSQL for users, business roles, permissions, assignments,
teams, memberships, activations, sessions, audit records, access decisions, and
administration event metadata; Redis for existing session/cache/queue transport
where Phase 0 infrastructure already uses it

**Testing**: Unit tests for permission matrix, validation, activation, session
revocation, admin lockout, team scoping, and audit metadata sanitization;
contract tests from OpenAPI; integration tests for user CRUD, activation,
role/team assignment, RBAC denials, session revocation, audit search, migration
from seeded Admin, and default-deny behavior; browser tests for Admin user
management, Manager team view, Operations Reviewer audit view, and permission
denied states; CI verification for build, tests, migrations, security checks,
and container startup

**Target Platform**: Browser web application plus server-side API running in
Linux containers

**Project Type**: Web application with separate frontend and backend apps in one
workspace

**Performance Goals**: Admin can create a user with an assigned role in under 2
minutes; 95% of user searches and filters display results within 2 seconds in a
normal local validation environment; authorized audit searches return usable
results within 30 seconds; affected sessions are revoked before further
protected access is allowed after disablement or required role removal

**Constraints**: Default-deny protected access; fixed Phase 1 business roles
only; no custom role creation or editable role permissions; one active team per
user; no raw passwords, activation secrets, session tokens, stack traces, or
credentials in responses or audit metadata; at least one active Admin must
remain; repeatable migrations from Phase 0 seeded Admin data; no CRM business
records in Phase 1

**Scale/Scope**: One users/RBAC module, one web management surface, fixed Admin,
Manager, Sales Representative business roles, one read-only operations reviewer
access profile, one permission matrix, team scoping with one active team per
user, activation setup records, session revocation behavior, searchable audit
review, OpenAPI contract, and focused verification paths

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. This feature delivers the single business
  capability "secure user administration and role-based access control." It
  touches user identity, role assignment, team membership, access decisions,
  session state, activation state, and audit records. It prepares future Lead,
  Activity, Follow-up, Deal, Revenue, Target, Exhibition, Analytics, and
  Notification access scoping but does not implement those business aggregates.
- **Secure access control**: PASS. The plan defines fixed Admin, Manager, Sales
  Representative roles, a read-only operations reviewer access profile, a
  permission matrix, one active team per user, default-deny enforcement,
  activation-based onboarding, immediate session revocation after disablement or
  required role removal, validation, safe errors, and sanitized audit metadata.
- **Test-first coverage**: PASS. Planning requires unit, contract, integration,
  security-path, migration, and browser tests before implementation tasks are
  accepted.
- **Auditable events**: PASS. User creation, activation, profile/status change,
  role assignment/removal, team assignment, session revocation, audit review,
  and denied access produce audit records and administration/security events
  with correlation identifiers and idempotency for repeated submissions.
- **Operational readiness**: PASS. Plan covers structured logs, metrics-worthy
  counters, safe error behavior, migrations, indexes, transaction boundaries,
  performance goals, CI checks, and local container verification.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` preserve all gates without adding custom roles, CRM business
records, audit export, or later-phase integrations.

## Project Structure

### Documentation (this feature)

```text
specs/002-users-rbac/
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
|   |   |-- (protected)/
|   |   |   |-- users/
|   |   |   |-- teams/
|   |   |   `-- audit/
|   |   `-- activate/
|   |-- features/
|   |   `-- users/
|   |       |-- api/
|   |       |-- components/
|   |       |-- hooks/
|   |       `-- validation/
|   `-- tests/
|       |-- e2e/
|       `-- users/
|-- api/
|   |-- prisma/
|   |-- src/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   |   |-- audit/
|   |   |   |   |-- permissions/
|   |   |   |   |-- teams/
|   |   |   |   `-- activation/
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
```

**Structure Decision**: Continue the Phase 0 single workspace with `apps/web`
and `apps/api`. The backend remains a modular monolith and expands the existing
`users` module for user administration, permissions, teams, activation, and
audit review. The frontend adds protected role-aware management surfaces rather
than a separate admin app.

## Complexity Tracking

No constitution violations identified. No exception is required.
