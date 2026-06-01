# Quickstart: Users & RBAC

## Prerequisites

- Phase 0 foundation is available locally.
- Node.js 24 LTS.
- pnpm 10 or newer.
- Docker with Compose support.
- Local PostgreSQL and Redis services from the foundation runtime.

## Environment

Use the Phase 0 local environment files and add Phase 1 values when
implementation introduces them:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Required local values include:

- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `SEEDED_ADMIN_EMAIL`
- `SEEDED_ADMIN_PASSWORD`
- `ACTIVATION_TOKEN_SECRET`
- `ACTIVATION_TOKEN_TTL_MINUTES`

Secrets must be local-only and must not be committed.

## Local Startup

Install dependencies:

```bash
pnpm install
```

Start local dependencies:

```bash
docker compose up -d postgres redis
```

Run migrations and seed or migrate the Admin user:

```bash
pnpm db:migrate
pnpm db:seed
```

Start the web and API apps:

```bash
pnpm dev
```

Expected local endpoints:

- Web app: `http://localhost:3000`
- API health: `http://localhost:3001/health/live`
- API readiness: `http://localhost:3001/health/ready`

## Phase 1 Verification

Run the focused Users & RBAC verification path when implementation adds it:

```bash
pnpm verify:users-rbac
```

The verification must confirm:

- The seeded Phase 0 Admin is migrated to an active Platform User with Admin
  role.
- Admin can create a user with a fixed business role and activation path.
- Expired or revoked activation paths cannot complete setup.
- Duplicate emails are rejected with safe errors.
- Admin can search, filter, sort, update, disable, and re-enable users.
- Disabling a user immediately revokes affected active sessions.
- Removing required role access immediately revokes affected active sessions.
- The platform prevents removing the final active Admin.
- Admin can create teams and assign one active team per user.
- Team movement retains prior membership history.
- Manager can view permitted team-scoped user information.
- Sales Representative cannot manage other users or grant permissions.
- Operations Reviewer can search audit records but cannot manage users, roles,
  teams, or sessions.
- Required user, role, team, session, activation, audit-review, and denied-access
  actions create sanitized security audit records.
- Permission denied, empty, loading, and validation states are visible in the web
  experience.

Implementation note: the initial verification command validates the generated
OpenAPI contract paths and is extended by the task list as runtime integration
coverage grows.

Latest local verification on 2026-05-31:

- `pnpm verify:users-rbac` passed.
- `pnpm --filter @crm/api test:unit` passed.
- `pnpm test:contract` passed.
- `pnpm test:integration` passed.
- `pnpm build` passed after running outside the sandbox because Windows blocked
  pnpm child-process spawning with `spawn EPERM` inside the sandbox.
- `pnpm --filter @crm/api build` passed after enabling local CORS for the web
  client request headers.
- Local web/API smoke checks passed: `GET http://localhost:3000/users`,
  `GET http://localhost:3001/users`, and the `/users` CORS preflight from
  `http://localhost:3000`.
- Browser test infrastructure issue under investigation. Unit, contract,
  integration, build and verification checks passed.

## Test Commands

Run unit tests:

```bash
pnpm test:unit
```

Run contract tests:

```bash
pnpm test:contract
```

Run integration tests:

```bash
pnpm test:integration
```

Run browser smoke tests:

```bash
pnpm test:e2e
```

Run the CI-equivalent quality pipeline locally:

```bash
pnpm ci:verify
```

The quality pipeline must validate build health, tests, security checks,
migrations, and container startup.

## Manual Acceptance Path

1. Sign in as the seeded Admin.
2. Open the protected user management area.
3. Create a Manager user and a Sales Representative user.
4. Complete activation for each user through the time-limited setup path.
5. Confirm the Admin can view and filter both users.
6. Create a team and assign the Manager and Sales Representative.
7. Sign in as the Manager and confirm team-scoped user visibility.
8. Sign in as the Sales Representative and confirm user-management actions are
   denied.
9. Remove a required role or disable a user and confirm affected sessions are
   revoked before further protected access.
10. Grant read-only operations reviewer access and confirm audit search works
    without user-management controls.

## Out Of Scope For Phase 1

- Custom role creation.
- Editable role permissions.
- Multiple active teams per user.
- Audit export.
- Lead, activity, follow-up, deal, revenue, target, exhibition, analytics,
  notification, WhatsApp, AI, or mobile-specific workflows.
- Production deployment approvals, environment promotion, rollback governance,
  dashboards, alerting rules, distributed tracing, and business KPI monitoring.
