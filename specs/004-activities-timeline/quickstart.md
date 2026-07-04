# Quickstart: Activities Timeline

## Prerequisites

- PostgreSQL and Redis available through the existing local environment.
- API dependencies installed.
- Web dependencies installed.
- Seeded users, roles, permissions, teams, lead sources, and lead records available.

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

5. Sign in as a seeded Admin user and verify:

   - `/activities` shows the protected activities workspace.
   - `/leads` still shows existing lead management behavior.
   - A lead detail page includes an activity timeline section.
   - A completed activity can be recorded for an accessible lead.
   - A planned follow-up can be scheduled, completed, reassigned, and canceled.
   - Manager/Sales Representative users only see activities for permitted lead/team scope.

## Required Test Commands

```bash
pnpm --filter @crm/api test:contract
pnpm --filter @crm/api test:unit
pnpm --filter @crm/api test:integration
pnpm --filter @crm/web test:unit
pnpm --filter @crm/web test:e2e
pnpm build
```

## Verification Status

Recorded on 2026-06-02:

- `pnpm --filter @crm/api exec prisma generate`: PASS.
- `pnpm verify:activities-timeline`: PASS.
- `pnpm --filter @crm/api test:contract`: PASS, 13 files and 14 tests.
- `pnpm --filter @crm/api test:unit`: PASS, 14 files and 26 tests.
- `pnpm --filter @crm/api test:integration`: PASS, 30 files and 33 tests.
- `pnpm --filter @crm/web test:unit`: PASS, 10 files and 18 tests.
- `pnpm --filter @crm/web test:e2e`: SKIPPED after interrupted local runs per user request.
- `pnpm build`: PASS for API Prisma generation, API TypeScript, and Next production build.
- `pnpm exec prettier --check .`: PASS after repo-wide Prettier formatting.

## Review Checklist

- API contract includes activity create/search/timeline/complete/reassign/cancel operations.
- Database migration adds activity persistence and expected indexes.
- RBAC and lead/team scope denial paths are covered.
- Audit entries and domain events are emitted for each state change.
- Activity workspace supports loading, empty, validation, denied, and error states.
- Existing lead, user, team, audit, and workspace shell behavior remains available.
