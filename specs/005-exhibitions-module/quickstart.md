# Quickstart: Exhibitions Module

## Prerequisites

- PostgreSQL and Redis available through the existing local environment.
- API dependencies installed.
- Web dependencies installed.
- Seeded users, roles, permissions, teams, lead sources, lead records, and activity/follow-up
  records available.

## Local Validation Flow

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start local infrastructure:

   ```bash
   docker compose up -d postgres redis
   ```

3. Apply migrations and seed baseline data:

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

4. Start the API and web app:

   ```bash
   pnpm dev
   ```

5. Sign in as a seeded Admin or Manager user and verify:

   - `/exhibitions` shows the protected exhibitions workspace.
   - A permitted user can create an exhibition with name, date range, location, owner, and status.
   - A Manager can assign eligible representatives to a permitted exhibition.
   - A permitted attendee or manager can confirm attendance where policy allows.
   - A permitted user can link an accessible lead to a full exhibition record.
   - Existing lightweight lead exhibition references can be reconciled without losing original
     reference history.
   - Exhibition detail shows attendee participation, attributed lead count, lead status summary,
     open follow-up count, overdue follow-up count, and recent activity indicators.
   - Manager/Sales Representative users only see exhibitions, attendees, and attributed leads inside
     permitted scope.

## Required Test Commands

```bash
pnpm --filter @crm/api test:contract
pnpm --filter @crm/api test:unit
pnpm --filter @crm/api test:integration
pnpm --filter @crm/web test:unit
pnpm --filter @crm/web test:e2e
pnpm build
```

## Review Checklist

- API contract includes exhibition create/search/detail/update/archive/restore, attendee
  assignment, attendance confirmation, lead attribution, and summary operations.
- Database migration adds exhibition persistence, attendance, attribution, history, access decision,
  and event records with expected indexes.
- RBAC, attendee, lead, and team scope denial paths are covered.
- Audit entries and domain events are emitted for each lifecycle, attendance, and attribution state
  change.
- Exhibition workspace and detail screens support loading, empty, validation, denied, stale update,
  and unavailable states.
- Existing lead, activity, user, team, audit, and workspace shell behavior remains available.
- Revenue ROI, commissions, targets, executive dashboards, notifications, AI, import/export, and
  mobile-specific workflows remain outside Phase 4.

## Validation Status
- Unit tests: PASS
- Contract tests: PASS
- Integration tests: PASS
- E2E tests: PASS
- Build: PASS
- Verifier: PASS
