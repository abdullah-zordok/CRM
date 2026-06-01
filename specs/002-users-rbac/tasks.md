# Tasks: Users & RBAC

**Input**: Design documents from `/specs/002-users-rbac/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required by the constitution and plan. Contract, unit, integration, security-path, migration, and browser tests are listed with the implementation work they validate.

## Phase 1: Backend Domain, Storage, and Security

- [X] Add Prisma models for platform users, fixed business roles, permissions, grants, role assignments, reviewer access, activation tokens, auth sessions, teams, memberships, access decisions, and security audit records in `apps/api/prisma/schema.prisma`
- [X] Align the initial migration with the Prisma schema in `apps/api/prisma/migrations/20260528224159_init/migration.sql`
- [X] Seed fixed roles, permission grants, and the seeded Admin in `apps/api/prisma/seed.ts`
- [X] Implement password hashing, session token hashing, cookie login/logout, and current-session APIs in `apps/api/src/modules/auth`
- [X] Implement session and permission guards with default-deny access recording in `apps/api/src/common/guards`
- [X] Implement user create/list/detail/update behavior in `apps/api/src/modules/users`
- [X] Implement activation issue and completion with hashed activation tokens and hashed passwords in `apps/api/src/modules/users/activation`
- [X] Implement fixed role assignment, reviewer access, and permission matrix APIs in `apps/api/src/modules/users/permissions`
- [X] Implement team creation, updates, and one-active-team membership behavior in `apps/api/src/modules/users/teams`
- [X] Implement sanitized security audit recording and search in `apps/api/src/modules/users/audit`

## Phase 2: Frontend Management Surfaces

- [X] Add protected user, team, and audit pages in `apps/web/app/(protected)`
- [X] Add activation completion page in `apps/web/app/activate/page.tsx`
- [X] Add users/RBAC API clients under `apps/web/features/users/api`
- [X] Add user, activation, role assignment, team, and audit UI components under `apps/web/features/users/components`
- [X] Remove fake `x-user-id` frontend headers and use session cookies for protected API calls

## Phase 3: Contracts, Tests, and Verification

- [X] Update the shared OpenAPI contract in `packages/contracts/openapi.yaml`
- [X] Add Users/RBAC contract tests in `apps/api/tests/contract`
- [X] Add permission, activation, team, and audit unit tests in `apps/api/tests/unit`
- [X] Add user management, disable/session revocation, role assignment, team scope, audit review, and denial integration tests in `apps/api/tests/integration`
- [X] Add browser scenario specs for users, roles, teams, and audit review in `apps/web/tests/e2e`
- [X] Add `pnpm verify:users-rbac` in `package.json` and `packages/test-utils/src/verify-users-rbac.ts`
- [X] Add Users/RBAC security and troubleshooting documentation in `docs/security/users-rbac.md` and `docs/troubleshooting/users-rbac.md`

## Deferred Runtime Check

- [ ] Playwright browser-suite execution is deferred in this environment because of the known Playwright runtime hang. The specs remain in `apps/web/tests/e2e`.
