# Foundation Architecture

Phase 0 establishes a single workspace with `apps/web`, `apps/api`, shared
configuration, contracts, test utilities, local Docker services, and CI quality
checks.

The backend remains a modular monolith. Modules are organized by operational
responsibility rather than by pages:

- Auth: seeded Admin login, logout, session state, role checks, and audit events.
- Foundation health: liveness, readiness, database/cache/queue checks.
- Foundation smoke: non-business event and background job verification.
- Infrastructure: database, cache, queues, events, and observability.

Later CRM modules must plug into these boundaries without moving Phase 1+ scope
into the foundation.
