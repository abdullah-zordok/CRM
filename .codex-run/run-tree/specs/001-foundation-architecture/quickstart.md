# Quickstart: Foundation Architecture

## Prerequisites

- Node.js 24 LTS
- pnpm 10 or newer
- Docker with Compose support
- Git

## Environment

Create local environment files from the committed examples once implementation
adds them:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Required local values:

- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `SEEDED_ADMIN_EMAIL`
- `SEEDED_ADMIN_PASSWORD`

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

Run migrations and seed the Admin user:

```bash
pnpm db:migrate
pnpm db:seed
```

Start the web and API apps:

```bash
pnpm dev
```

Expected local endpoints:

- Web shell: `http://localhost:3000`
- API health: `http://localhost:3001/health/live`
- API readiness: `http://localhost:3001/health/ready`

## Foundation Verification

Run the full local verification path:

```bash
pnpm verify:foundation
```

The verification must confirm:

- API liveness and readiness.
- Database and cache connectivity.
- Migrations are applied from a clean state.
- Seeded Admin can log in and log out.
- Anonymous access to the protected shell is denied.
- Authenticated Admin can access the protected shell.
- Login, logout, and denied access create security audit records.
- A smoke event can queue a smoke background job.
- Smoke job completion, retry, or failure visibility is observable.
- Structured logs include correlation identifiers.

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

## Container Startup Check

Build and start the full local stack:

```bash
docker compose up --build
```

Then verify:

```bash
curl http://localhost:3001/health/ready
```

The readiness response must not expose secrets, stack traces, or raw connection
strings.

## Out Of Scope For Phase 0

- Full user management.
- Team hierarchy.
- Permission administration UI.
- Audit log browsing UI.
- Lead, activity, deal, revenue, target, exhibition, analytics, notification,
  WhatsApp, AI, or mobile-specific workflows.
- Production deployment approvals, environment promotion, rollback governance,
  dashboards, alerting rules, distributed tracing, and business KPI monitoring.
