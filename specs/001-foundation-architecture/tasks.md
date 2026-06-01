# Tasks: Foundation Architecture

**Input**: Design documents from `/specs/001-foundation-architecture/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required by the constitution and plan. Contract, unit, integration, security-path, migration, queue, and browser smoke tests must be written before implementation tasks in each story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the TypeScript workspace, application shells, shared tooling, and local runtime skeleton.

- [X] T001 Create workspace directories `apps/web`, `apps/api`, `packages/config`, `packages/contracts`, `packages/test-utils`, `infra/docker`, `infra/local`, and `.github/workflows`
- [X] T002 Create root package manifest and workspace configuration in `package.json`, `pnpm-workspace.yaml`, and `.npmrc`
- [X] T003 [P] Configure TypeScript shared settings in `tsconfig.base.json`, `packages/config/tsconfig.json`, `apps/web/tsconfig.json`, and `apps/api/tsconfig.json`
- [X] T004 [P] Configure linting and formatting in `eslint.config.mjs`, `prettier.config.cjs`, and `.prettierignore`
- [X] T005 [P] Create Docker Compose services for web, api, postgres, and redis in `docker-compose.yml`
- [X] T006 [P] Add local environment examples in `apps/api/.env.example` and `apps/web/.env.example`
- [X] T007 [P] Add shared contract copy of `specs/001-foundation-architecture/contracts/openapi.yaml` to `packages/contracts/openapi.yaml`
- [X] T008 [P] Create baseline Next.js App Router files in `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `apps/web/app/globals.css`, and `apps/web/next.config.ts`
- [X] T009 [P] Create baseline NestJS Fastify app files in `apps/api/src/main.ts`, `apps/api/src/app.module.ts`, and `apps/api/src/config/env.schema.ts`
- [X] T010 Add workspace scripts for `dev`, `build`, `lint`, `format:check`, `test:unit`, `test:contract`, `test:integration`, `test:e2e`, `db:migrate`, `db:seed`, `verify:foundation`, and `ci:verify` in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish database, validation, observability, error handling, test harnesses, and contract tooling that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Create Prisma schema datasource and generator in `apps/api/prisma/schema.prisma`
- [X] T012 Create initial Prisma migration placeholder and migration README in `apps/api/prisma/migrations/README.md`
- [X] T013 [P] Implement environment validation loader in `apps/api/src/config/env.module.ts` and `apps/api/src/config/env.service.ts`
- [X] T014 [P] Implement shared request correlation middleware in `apps/api/src/common/middleware/correlation.middleware.ts`
- [X] T015 [P] Implement safe error filter in `apps/api/src/common/filters/http-exception.filter.ts`
- [X] T016 [P] Implement Zod validation pipe in `apps/api/src/common/validation/zod-validation.pipe.ts`
- [X] T017 [P] Implement structured logger module in `apps/api/src/infrastructure/observability/logger.module.ts`
- [X] T018 [P] Create API test bootstrap utilities in `apps/api/tests/support/test-app.ts` and `apps/api/tests/support/test-database.ts`
- [X] T019 [P] Create web test bootstrap utilities in `apps/web/tests/support/render.tsx` and `apps/web/tests/support/playwright.config.ts`
- [X] T020 [P] Configure API unit, contract, and integration test runners in `apps/api/vitest.config.ts`
- [X] T021 [P] Configure web unit and browser smoke test runners in `apps/web/vitest.config.ts` and `apps/web/playwright.config.ts`
- [X] T022 [P] Create OpenAPI contract test helper in `packages/test-utils/src/openapi-contract.ts`
- [X] T023 [P] Create shared test data factories in `packages/test-utils/src/foundation-factories.ts`
- [X] T024 Add CI quality pipeline skeleton in `.github/workflows/ci.yml`
- [X] T025 Add root documentation for Phase 0 local commands in `README.md`

**Checkpoint**: Foundation prerequisites ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Establish Project Foundation (Priority: P1)

**Goal**: A new developer or reviewer can start and verify a healthy application shell and clear project boundaries without later CRM modules.

**Independent Test**: Start the local stack, verify API liveness/readiness, open the web shell, and confirm documented boundaries for UI, business operations, persistence, events, queues, configuration, and tests.

### Tests for User Story 1

- [X] T026 [P] [US1] Add contract tests for `GET /health/live` and `GET /health/ready` in `apps/api/tests/contract/health.contract.test.ts`
- [X] T027 [P] [US1] Add integration tests for readiness dependency reporting in `apps/api/tests/integration/health-readiness.integration.test.ts`
- [X] T028 [P] [US1] Add web shell smoke test for unauthenticated landing behavior in `apps/web/tests/e2e/foundation-shell.e2e.ts`
- [X] T029 [P] [US1] Add migration clean-state test in `apps/api/tests/integration/migrations.integration.test.ts`
- [X] T030 [P] [US1] Add config validation unit tests in `apps/api/tests/unit/env-schema.test.ts`

### Implementation for User Story 1

- [X] T031 [US1] Add `HealthCheckResult` model and foundation enums to `apps/api/prisma/schema.prisma`
- [X] T032 [US1] Create Prisma migration for health foundation metadata in `apps/api/prisma/migrations/001_foundation_init/migration.sql`
- [X] T033 [US1] Implement database module in `apps/api/src/infrastructure/database/database.module.ts` and `apps/api/src/infrastructure/database/prisma.service.ts`
- [X] T034 [US1] Implement cache module in `apps/api/src/infrastructure/cache/cache.module.ts` and `apps/api/src/infrastructure/cache/redis.service.ts`
- [X] T035 [US1] Implement health module in `apps/api/src/modules/foundation/health/health.module.ts`, `apps/api/src/modules/foundation/health/health.controller.ts`, and `apps/api/src/modules/foundation/health/health.service.ts`
- [X] T036 [US1] Wire health, database, cache, logger, validation, and error filter modules into `apps/api/src/app.module.ts`
- [X] T037 [US1] Implement web application shell layout in `apps/web/app/(foundation)/layout.tsx` and `apps/web/app/(foundation)/page.tsx`
- [X] T038 [US1] Add shared web foundation status client in `apps/web/features/foundation/api/foundation-status.ts`
- [X] T039 [US1] Add startup and boundary documentation in `apps/api/README.md` and `apps/web/README.md`
- [X] T040 [US1] Implement `pnpm verify:foundation` health and web shell checks in `packages/test-utils/src/verify-foundation.ts`

**Checkpoint**: User Story 1 is independently testable through health/readiness, web shell, migration, and documentation checks.

---

## Phase 4: User Story 2 - Enforce Secure Access Baseline (Priority: P1)

**Goal**: Minimal login/logout, protected shell access, seeded Admin, baseline role checks, auth state, and security audit records are working without full user management.

**Independent Test**: Anonymous access is denied, seeded Admin can sign in and out, protected shell is only accessible during an authenticated session, baseline roles exist, and audit records are persisted for login/logout/denied access.

### Tests for User Story 2

- [X] T041 [P] [US2] Add contract tests for `/auth/login`, `/auth/logout`, `/auth/me`, and `/foundation/protected-shell/access` in `apps/api/tests/contract/auth.contract.test.ts`
- [X] T042 [P] [US2] Add integration tests for seeded Admin login/logout/session lifecycle in `apps/api/tests/integration/auth-session.integration.test.ts`
- [X] T043 [P] [US2] Add security-path tests for anonymous denial and role denial in `apps/api/tests/integration/rbac-denial.integration.test.ts`
- [X] T044 [P] [US2] Add audit persistence tests for login, logout, and denied access in `apps/api/tests/integration/security-audit.integration.test.ts`
- [X] T045 [P] [US2] Add unit tests for password hashing, session hashing, and role checks in `apps/api/tests/unit/auth-security.test.ts`
- [X] T046 [P] [US2] Add browser smoke tests for login, protected shell, and logout in `apps/web/tests/e2e/auth-shell.e2e.ts`

### Implementation for User Story 2

- [X] T047 [US2] Add `FoundationUser`, `RoleCategory`, `FoundationUserRole`, `AuthSession`, `AccessDecision`, and `SecurityAuditRecord` models to `apps/api/prisma/schema.prisma`
- [X] T048 [US2] Create Prisma migration for identity, roles, auth state, access decisions, and audit records in `apps/api/prisma/migrations/002_foundation_auth/migration.sql`
- [X] T049 [US2] Implement seed script for Admin, Manager, and Sales Representative role categories and seeded Admin user in `apps/api/prisma/seed.ts`
- [X] T050 [US2] Implement password and session hashing utilities in `apps/api/src/modules/auth/security/password.service.ts` and `apps/api/src/modules/auth/security/session-token.service.ts`
- [X] T051 [US2] Implement auth repository in `apps/api/src/modules/auth/auth.repository.ts`
- [X] T052 [US2] Implement security audit repository and service in `apps/api/src/modules/auth/audit/security-audit.repository.ts` and `apps/api/src/modules/auth/audit/security-audit.service.ts`
- [X] T053 [US2] Implement auth service in `apps/api/src/modules/auth/auth.service.ts`
- [X] T054 [US2] Implement login, logout, and current session endpoints in `apps/api/src/modules/auth/auth.controller.ts`
- [X] T055 [US2] Implement session guard and role guard in `apps/api/src/common/guards/session.guard.ts` and `apps/api/src/common/guards/role.guard.ts`
- [X] T056 [US2] Implement role decorator in `apps/api/src/common/decorators/roles.decorator.ts`
- [X] T057 [US2] Implement protected shell access endpoint in `apps/api/src/modules/foundation/protected-shell/protected-shell.controller.ts`
- [X] T058 [US2] Wire auth and protected shell modules into `apps/api/src/app.module.ts`
- [X] T059 [US2] Implement web login page and form in `apps/web/app/login/page.tsx` and `apps/web/features/foundation/auth/login-form.tsx`
- [X] T060 [US2] Implement web auth client and session query in `apps/web/features/foundation/auth/auth-client.ts` and `apps/web/features/foundation/auth/use-session.ts`
- [X] T061 [US2] Implement protected shell route guard and logout action in `apps/web/app/(protected)/layout.tsx` and `apps/web/features/foundation/auth/logout-button.tsx`
- [X] T062 [US2] Update quickstart seed and login verification steps in `specs/001-foundation-architecture/quickstart.md`

**Checkpoint**: User Story 2 is independently testable through auth contract, integration, security-path, audit, and browser smoke tests.

---

## Phase 5: User Story 3 - Prepare Operational Reliability (Priority: P2)

**Goal**: Automated quality pipeline, smoke event, background job, retry visibility, structured logs, health/readiness signals, audit events, job status, and request correlation are ready for future CRM workflows.

**Independent Test**: Run the CI-equivalent verification path and confirm build, tests, security checks, migrations, container startup, smoke event/job processing, retry/failure visibility, and correlated structured logs.

### Tests for User Story 3

- [X] T063 [P] [US3] Add contract tests for `POST /foundation/smoke-events` and `GET /foundation/jobs/{jobId}` in `apps/api/tests/contract/foundation-smoke.contract.test.ts`
- [X] T064 [P] [US3] Add integration tests for smoke event creation and job completion in `apps/api/tests/integration/smoke-job.integration.test.ts`
- [X] T065 [P] [US3] Add retry and idempotency tests for smoke background jobs in `apps/api/tests/integration/smoke-job-retry.integration.test.ts`
- [X] T066 [P] [US3] Add unit tests for event payload validation and CRM data rejection in `apps/api/tests/unit/operational-event.test.ts`
- [X] T067 [P] [US3] Add observability tests for correlation IDs and structured log fields in `apps/api/tests/integration/observability.integration.test.ts`
- [X] T068 [P] [US3] Add CI script smoke test for `pnpm ci:verify` command composition in `packages/test-utils/src/ci-verify.test.ts`

### Implementation for User Story 3

- [X] T069 [US3] Add `OperationalEvent` and `BackgroundJob` models plus supporting enums to `apps/api/prisma/schema.prisma`
- [X] T070 [US3] Create Prisma migration for operational events and background job metadata in `apps/api/prisma/migrations/003_foundation_events_jobs/migration.sql`
- [X] T071 [US3] Implement event bus module in `apps/api/src/infrastructure/events/events.module.ts`, `apps/api/src/infrastructure/events/event-bus.service.ts`, and `apps/api/src/infrastructure/events/event-types.ts`
- [X] T072 [US3] Implement queue module in `apps/api/src/infrastructure/queues/queues.module.ts`, `apps/api/src/infrastructure/queues/foundation-smoke.queue.ts`, and `apps/api/src/infrastructure/queues/job-status.repository.ts`
- [X] T073 [US3] Implement smoke event service in `apps/api/src/modules/foundation/smoke/smoke-event.service.ts`
- [X] T074 [US3] Implement smoke job processor with retry and idempotency in `apps/api/src/modules/foundation/smoke/smoke-job.processor.ts`
- [X] T075 [US3] Implement smoke event and job status endpoints in `apps/api/src/modules/foundation/smoke/smoke.controller.ts`
- [X] T076 [US3] Wire smoke event, queue, and event bus modules into `apps/api/src/app.module.ts`
- [X] T077 [US3] Extend readiness checks with database, cache, and queue status in `apps/api/src/modules/foundation/health/health.service.ts`
- [X] T078 [US3] Extend structured logging with correlation IDs and sanitized metadata in `apps/api/src/infrastructure/observability/logger.interceptor.ts`
- [X] T079 [US3] Implement web smoke job verification panel in `apps/web/features/foundation/smoke/smoke-job-panel.tsx` and `apps/web/app/(protected)/foundation/page.tsx`
- [X] T080 [US3] Implement CI quality pipeline steps in `.github/workflows/ci.yml`
- [X] T081 [US3] Implement local `pnpm ci:verify` orchestration in `packages/test-utils/src/ci-verify.ts`
- [X] T082 [US3] Update `specs/001-foundation-architecture/quickstart.md` with smoke event/job and CI verification commands

**Checkpoint**: User Story 3 is independently testable through smoke event/job, observability, readiness, and CI verification.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, documentation, and traceability checks across all stories.

- [X] T083 [P] Update root implementation documentation in `README.md`
- [X] T084 [P] Add architecture decision notes for Phase 0 in `docs/architecture/foundation-architecture.md`
- [X] T085 [P] Add security notes for secrets, cookies, safe errors, and audit records in `docs/security/foundation-security.md`
- [X] T086 [P] Add troubleshooting notes for Docker, PostgreSQL, Redis, migrations, and seeded Admin in `docs/troubleshooting/foundation.md`
- [X] T087 Run OpenAPI validation and update generated contract snapshot in `packages/contracts/openapi.yaml`
- [X] T088 Run full local quickstart validation and record fixes in `specs/001-foundation-architecture/quickstart.md`
- [X] T089 Run final security review for no raw secrets, raw tokens, stack traces, or CRM business records in `apps/api/src` and `apps/web`
- [X] T090 Run final `pnpm ci:verify` from `package.json` and ensure all `.github/workflows/ci.yml` checks pass before Phase 0 completion

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers MVP foundation startup and shell.
- **User Story 2 (Phase 4)**: Depends on Foundational; may run after or alongside US1 once shared health/database modules exist, but is accepted independently through auth and audit tests.
- **User Story 3 (Phase 5)**: Depends on Foundational and benefits from US1 health/readiness infrastructure; can be implemented after US1 for lowest integration risk.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 - Establish Project Foundation**: MVP scope. No dependency on other stories after Foundational.
- **US2 - Enforce Secure Access Baseline**: Requires Foundational database and validation primitives; does not require US3.
- **US3 - Prepare Operational Reliability**: Requires Foundational queue/cache primitives and reuses US1 readiness patterns.

### Within Each User Story

- Tests must be written and fail before implementation.
- Models and migrations before repositories/services.
- Services before controllers/endpoints.
- API behavior before web integration.
- Story checkpoint must pass before moving to the next priority.

---

## Parallel Opportunities

- Setup tasks T003-T009 can run in parallel after T001-T002.
- Foundational tasks T013-T023 can run in parallel after database and workspace scaffolding exist.
- US1 tests T026-T030 can run in parallel before implementation.
- US2 tests T041-T046 can run in parallel before implementation.
- US3 tests T063-T068 can run in parallel before implementation.
- Documentation polish tasks T083-T086 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T026 [P] [US1] Add contract tests for health endpoints in apps/api/tests/contract/health.contract.test.ts"
Task: "T027 [P] [US1] Add integration tests for readiness dependency reporting in apps/api/tests/integration/health-readiness.integration.test.ts"
Task: "T028 [P] [US1] Add web shell smoke test in apps/web/tests/e2e/foundation-shell.e2e.ts"
Task: "T029 [P] [US1] Add migration clean-state test in apps/api/tests/integration/migrations.integration.test.ts"
Task: "T030 [P] [US1] Add config validation unit tests in apps/api/tests/unit/env-schema.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T041 [P] [US2] Add auth contract tests in apps/api/tests/contract/auth.contract.test.ts"
Task: "T042 [P] [US2] Add auth session integration tests in apps/api/tests/integration/auth-session.integration.test.ts"
Task: "T043 [P] [US2] Add RBAC denial tests in apps/api/tests/integration/rbac-denial.integration.test.ts"
Task: "T044 [P] [US2] Add security audit tests in apps/api/tests/integration/security-audit.integration.test.ts"
Task: "T046 [P] [US2] Add browser auth shell smoke tests in apps/web/tests/e2e/auth-shell.e2e.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T063 [P] [US3] Add smoke API contract tests in apps/api/tests/contract/foundation-smoke.contract.test.ts"
Task: "T064 [P] [US3] Add smoke job integration tests in apps/api/tests/integration/smoke-job.integration.test.ts"
Task: "T065 [P] [US3] Add retry and idempotency tests in apps/api/tests/integration/smoke-job-retry.integration.test.ts"
Task: "T067 [P] [US3] Add observability integration tests in apps/api/tests/integration/observability.integration.test.ts"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate health/readiness, clean migrations, web shell, and foundation documentation.
4. Stop and review before adding auth or operational reliability depth.

### Incremental Delivery

1. Deliver US1 for startable foundation and project boundaries.
2. Deliver US2 for secure access, seeded Admin, role checks, and audit records.
3. Deliver US3 for queue/event readiness, observability, and CI pipeline.
4. Complete Polish after all selected stories pass their independent tests.

### Validation Commands

```bash
pnpm test:unit
pnpm test:contract
pnpm test:integration
pnpm test:e2e
pnpm verify:foundation
pnpm ci:verify
```

### Notes

- Phase 0 must not create live CRM business records.
- Full user management, team hierarchy, permission administration, audit browsing, dashboards, production release governance, WhatsApp, AI, and mobile-specific workflows remain out of scope.
- Commit after each task or logical group once tests pass.
