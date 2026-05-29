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

No lead, deal, revenue, target, WhatsApp, AI, or dashboard business modules are
implemented in Phase 0.
