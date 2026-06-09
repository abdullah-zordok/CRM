# Implementation Plan: User and Lead Recovery

**Branch**: `007-user-lead-recovery` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-user-lead-recovery/spec.md`

## Summary

Deliver a recovery feature that makes Admin-created users immediately able to sign in, restores safe user lifecycle controls, fixes Sales Representative lead creation by assigning ownership to the current user, and adds role-scoped operational accountability metrics. The implementation updates the existing auth, users/RBAC, leads, activities/follow-ups, dashboard, audit, and domain event paths instead of introducing a new standalone module.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: Next.js App Router, React, TanStack Query, Tailwind CSS, shadcn/ui, lucide-react, NestJS, Fastify adapter, Prisma ORM, PostgreSQL, Redis, BullMQ, Docker, GitHub Actions, Zod, pino-compatible structured logging, OpenAPI, existing auth/session, RBAC, users, teams, leads, activities, follow-ups, audit, and event bus modules

**Storage**: PostgreSQL via Prisma for user credential hashes, active/deleted lifecycle fields, preserved user references, sessions, lead owner/creator attribution, activity/follow-up metrics, security audit records, and domain event records. Redis remains available for existing cache/session/queue infrastructure; no new retryable queue jobs are required for this recovery feature.

**Testing**: Unit tests for password validation, user creation status, login eligibility, deletion safeguards, active Admin counting, lead owner assignment, role/team visibility, dashboard metric aggregation, and audit/event payload sanitization; contract tests for user creation/login/delete, lead creation/list/detail, and dashboard metrics; integration tests for Admin-created immediate login, disabled/deleted login denial, self-delete and last-admin denial, preserved historical lead ownership, Sales Representative lead creation without alternate owner lookup, Manager team scope, Admin global scope, and audit/domain events; browser tests for user form password flow, delete confirmation, login-ready user workflow, lead creation, scoped lead lists, dashboard metrics, empty states, denied states, and keyboard access.

**Target Platform**: Browser-based CRM workspace with protected API services running in existing Docker/local and CI environments.

**Project Type**: Full-stack web application capability within the existing monorepo.

**Performance Goals**: Admin can create a login-ready user in under 2 minutes; a newly created Sales Representative can sign in and open lead management in under 3 minutes; Sales Representatives can create owned leads in under 2 minutes; normal lead lists and dashboard metric views render usable results or empty states within 3 seconds; Admin and Manager dashboard accountability metrics are available within 30 seconds during normal workspace use.

**Constraints**: Protected access remains default-deny; raw passwords, session tokens, credential secrets, stack traces, and hidden audit metadata must never be returned or logged; Admin-created users are active immediately in this phase; email invitation, activation link delivery, self-registration, password reset redesign, AI, forecasting, recommendations, WhatsApp automation, executive analytics, revenue attribution, commission calculations, and advanced reporting remain out of scope; deleting users must preserve historical leads, activities, notes, follow-ups, reports, owner references, creator references, and audit records; self-deletion and last-active-admin removal are blocked; role, ownership, and team scope are enforced on all lead, activity, follow-up, and metric reads.

**Scale/Scope**: Recovery changes across existing Auth, Users/RBAC, Teams, Leads, Activities/Follow-ups, Dashboard, Audit, and Event modules; protected user management and lead management web surfaces; operational metrics for total leads, leads by representative, leads by team, leads by source, representative activity count, follow-up count, and last activity. No new bounded context, no separate service, and no advanced analytics module.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. The single capability is "operational user access and lead ownership recovery." It touches User, Role, Team, Lead, Activity, Follow-up, dashboard metric, audit, and domain event records. It restores the operational foundation required before later Deal, Revenue, Target, Exhibition, Analytics, Notification, WhatsApp, AI, and automation capabilities.
- **Secure access control**: PASS. Admins can create, update, disable, delete, and view users and global operational metrics. Managers can view team-scoped leads, activities, follow-ups, and metrics. Sales Representatives can sign in, create leads, view owned leads, and add permitted notes/follow-ups. Denials are default-deny and privacy-safe. Validation covers credentials, duplicate email, role eligibility, active/deleted status, last-active-admin safety, self-deletion safety, lead required fields, owner assignment, and dashboard scope.
- **Test-first coverage**: PASS. Required coverage includes unit tests for credential, lifecycle, ownership, scope, metrics, and event rules; contract tests for changed API boundaries; integration tests for end-to-end recovery workflows and denial paths; browser tests for user, login, lead, dashboard, empty, denied, and confirmation states.
- **Auditable events**: PASS. UserCreated, UserActivated, UserUpdated, UserDisabled, UserDeleted, UserDeletionBlocked, LoginSucceeded, LoginDenied, LeadCreated, LeadOwnershipAssigned, LeadVisibilityDenied, NoteAdded, FollowUpAdded, and DashboardMetricsViewed events are required with sanitized payloads and correlation identifiers. Audit records are append-only. No new queue jobs are introduced.
- **Operational readiness**: PASS. Plan covers Prisma migration/update paths, indexes for active user, deleted user, lead owner/creator, team scope, activity/follow-up, and dashboard summary queries; transaction boundaries for user creation, deletion, last-admin checks, lead creation/ownership, and metric reads; structured logs, safe errors, metrics-worthy counters, local verification, CI, and existing Docker deployment.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` preserve all gates and keep activation emails, self-registration, password reset redesign, advanced analytics, AI, WhatsApp automation, forecasting, revenue attribution, and commission workflows out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/006-user-lead-recovery/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- user-lead-recovery-api.yaml
|   `-- user-lead-recovery-ui.md
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
|       |-- modules/
|       |   |-- auth/
|       |   |-- users/
|       |   |   |-- audit/
|       |   |   |-- permissions/
|       |   |   `-- teams/
|       |   |-- leads/
|       |   |   |-- activities/
|       |   |   |-- audit/
|       |   |   |-- events/
|       |   |   |-- notes/
|       |   |   `-- permissions/
|       |   |-- foundation/
|       |   `-- dashboards/
|       |-- common/
|       |-- infrastructure/
|       `-- config/
|   `-- tests/
|       |-- contract/
|       |-- integration/
|       |-- unit/
|       `-- support/
|-- web/
|   |-- app/
|   |   `-- (protected)/
|   |       |-- users/
|   |       |-- leads/
|   |       |-- dashboard/
|   |       `-- team/
|   |-- features/
|   |   |-- foundation/
|   |   |-- users/
|   |   |-- leads/
|   |   |-- activities/
|   |   `-- workspace/
|   `-- tests/
|       |-- e2e/
|       `-- frontend-shell/
packages/
|-- contracts/
`-- test-utils/
    `-- src/
```

**Structure Decision**: Implement as scoped updates inside the existing full-stack monorepo. The backend keeps auth, users/RBAC, teams, leads, activities/follow-ups, audit, and event responsibilities in their existing module boundaries; only a small dashboard summary boundary may be added if no current metric service exists. The frontend updates protected user management, lead management, dashboard, and team views using existing feature folders and workspace navigation.

## Complexity Tracking

No constitution violations identified. No exception is required.
