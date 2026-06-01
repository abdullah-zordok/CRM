# Quickstart: Leads Core

## Prerequisites

- Phase 0 foundation is available locally.
- Phase 1 Users & RBAC is available locally.
- Node.js 24 LTS.
- pnpm 10 or newer.
- Docker with Compose support.
- Local PostgreSQL and Redis services from the foundation runtime.

## Environment

Use the existing local environment files and add Phase 2 values only when
implementation introduces them:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Required local values continue to include:

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

Run migrations and seed foundation, users, RBAC, and lead source data:

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
- Leads area: `http://localhost:3000/leads`
- Leads API: `http://localhost:3001/leads`

## Phase 2 Verification

Run the focused Leads Core verification path when implementation adds it:

```bash
pnpm verify:leads-core
```

The verification must confirm:

- Admin can create, view, update, assign, and reassign leads across teams.
- Manager can manage leads inside their permitted team scope.
- Sales Representative can create leads and manage owned or explicitly visible
  leads but cannot assign leads to other users.
- Anonymous and unauthorized users are denied protected lead actions.
- Required lead identity, contact, source, owner, status, and priority fields
  are validated.
- Platform-wide active duplicate email or phone matches are blocked.
- Restricted duplicate matches return privacy-safe guidance without exposing the
  hidden lead.
- Disabled, inactive, or ineligible users cannot be assigned as lead owners.
- Sales Representative status changes follow New -> Contacted -> Qualified ->
  Negotiation -> Won or Lost.
- Admin and Manager correction, archive, and restore paths are recorded.
- Lightweight exhibition references capture name, date, and location when
  provided.
- Lead notes are append-only and visible only to users with lead access.
- Stale updates are rejected and the newest saved lead version is preserved.
- Search, filtering, sorting, and list navigation remain usable for up to 10,000
  active leads.
- Lead creation, assignment, status, source, exhibition reference, note,
  duplicate, stale-update, and denied-access actions create sanitized audit
  records and lead domain events.
- Empty, loading, validation, duplicate, permission-denied, and conflict states
  are visible in the web experience.

Implementation note: the initial verification command should validate the
generated OpenAPI contract paths and then expand into runtime integration and
browser coverage as tasks are completed.

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
2. Confirm Phase 1 users, roles, and teams are available.
3. Open the protected leads area.
4. Create a lead with display name or company, email or phone, source, priority,
   owner, optional budget, optional exhibition reference, and initial note.
5. Attempt to create another active lead with the same email or phone and
   confirm the duplicate is blocked.
6. Sign in as a Manager and assign an in-scope lead to a Sales Representative in
   the Manager's team.
7. Sign in as the Sales Representative and confirm only permitted leads are
   visible.
8. Move the lead through the normal status flow and confirm invalid backward
   movement is denied for the Sales Representative.
9. Sign in as Manager or Admin and correct a status, archive a lead, and restore
   it with traceable history.
10. Add a lead note and confirm the note is append-only.
11. Open the same lead in two sessions, save one update, and confirm the older
    version is rejected as stale.
12. Review security audit and lead history entries for the above actions.

## Out Of Scope For Phase 2

- Full activities timeline.
- Follow-up scheduling.
- Calls, meetings, visits, and WhatsApp logs.
- Full exhibition management and exhibition analytics.
- Deals, revenue, commissions, targets, executive analytics, notifications, AI
  scoring, forecasting, bulk import/export, and mobile-specific workflows.
