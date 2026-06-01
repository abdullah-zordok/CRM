# Sales Operations CRM

Phase 0 implements the foundation architecture for a secure, spec-driven CRM
platform. It includes a web shell, API shell, minimal authentication baseline,
PostgreSQL persistence, Redis-backed queue readiness, observability, and CI
quality checks.

## Commands

```bash
pnpm install
pnpm dev
pnpm db:migrate
pnpm db:seed
pnpm verify:foundation
pnpm ci:verify
```

See `specs/001-foundation-architecture/quickstart.md` for the full verification
flow.
