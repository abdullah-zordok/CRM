# Web Foundation

The web app contains the Phase 0 protected shell and minimal login flow.

## Boundaries

- `app/page.tsx`: public entry point.
- `app/login/page.tsx`: seeded Admin login page.
- `app/(protected)/foundation/page.tsx`: protected foundation shell.
- `features/foundation`: clients and UI for foundation status, auth, and smoke jobs.

## Leads Core

Phase 2 adds protected lead management routes:

- `/leads`: lead list, create form, and pipeline filters.
- `/leads/[leadId]`: lead detail, source context, assignment, status, notes, and
  history panels.

Set `NEXT_PUBLIC_API_BASE_URL` to the API origin when it differs from
`http://localhost:3001`.

### Browser Validation

Run browser coverage after the API, database, Redis, migrations, and seed data
are available:

```bash
pnpm --filter @crm/web test:e2e
```

The Leads e2e specs in `tests/e2e/leads-*.e2e.ts` cover protected route access,
lead creation validation, duplicate and permission-denied states, assignment
controls, status pipeline actions, archive/restore feedback, notes, history, and
loading/empty/error states. The web UI should not expose restricted duplicate
details or hidden lead contact data.
