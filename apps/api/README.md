# API Foundation

The API app contains the Phase 0 NestJS modular monolith foundation.

## Boundaries

- `src/modules/auth`: minimal seeded Admin login, session, role checks, and audit.
- `src/modules/foundation`: health, protected shell access, and smoke job checks.
- `src/infrastructure/database`: Prisma client and migrations.
- `src/infrastructure/cache`: Redis client.
- `src/infrastructure/events`: internal event bus readiness.
- `src/infrastructure/queues`: Redis-backed queue readiness.
- `src/infrastructure/observability`: structured logs and correlation.

## Leads Core

Phase 2 adds `src/modules/leads` for lead creation, scoped list/detail access,
assignment, status changes, append-only notes, history, and lightweight
exhibition references.

### Environment

Leads Core uses the existing API environment values:

- `DATABASE_URL` for PostgreSQL persistence.
- `REDIS_URL` for queue/event infrastructure readiness.
- `SESSION_SECRET` for protected session validation.
- `SEEDED_ADMIN_EMAIL` and `SEEDED_ADMIN_PASSWORD` for local acceptance checks.
- `ACTIVATION_TOKEN_SECRET` and `ACTIVATION_TOKEN_TTL_MINUTES` for Phase 1 user
  activation flows used by role-scoped lead validation.

No lead-specific secrets are required. Do not commit local `.env` files or
production credentials.

### Migration And Seed

Run the Leads Core migration and seed data before validating the API:

```bash
pnpm --filter @crm/api exec prisma migrate deploy
pnpm --filter @crm/api exec prisma db seed
pnpm verify:leads-core
```

The module depends on Phase 1 users, roles, teams, sessions, permission checks,
and security audit records. Lead sources are seeded as `EXHIBITION`, `REFERRAL`,
`WEBSITE`, `INBOUND_INQUIRY`, `MANUAL_ENTRY`, and `OTHER`.

### Verification

Use these commands when changing lead behavior:

```bash
pnpm test:unit
pnpm test:contract
pnpm test:integration
pnpm verify:leads-core
```

The focused verifier covers the OpenAPI contract paths, scoped create/list/detail
behavior, duplicate blocking, assignment, status changes, notes, history,
sanitized audit records, domain events, stale update handling, and search
validation for the Phase 2 scale target.

Deal, revenue, target, WhatsApp, AI, analytics, import/export, notification, and
mobile-specific workflows remain outside Phase 2.
