# Quickstart: User and Lead Recovery

## Prerequisites

- Foundation architecture is available locally.
- Users/RBAC, Leads Core, and Activities/Follow-ups foundations are available locally.
- Node.js 24 LTS.
- pnpm 10 or newer.
- Docker with Compose support.
- Local PostgreSQL and Redis services from the existing runtime.

## Environment

Use existing local environment files:

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

Secrets must remain local-only and must not be committed. Activation email or invitation secrets are not required for this recovery workflow.

## Local Startup

Install dependencies:

```bash
pnpm install
```

Start local dependencies:

```bash
docker compose up -d postgres redis
```

Run migrations and seed data:

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
- Users area: `http://localhost:3000/users`
- Leads area: `http://localhost:3000/leads`
- Dashboard: `http://localhost:3000/dashboard`

## Recovery Verification

Run the focused verification path when implementation adds it:

```bash
pnpm verify:user-lead-recovery
```

The verification must confirm:

- Admin can create an active Sales Representative with email, display name, password, and role.
- Raw passwords are not returned in responses, logs, events, or audit records.
- The new Sales Representative can sign in immediately without activation.
- Disabled and deleted users cannot sign in.
- Admin cannot delete or disable their own active account.
- The CRM blocks deletion or disablement that would leave zero active Admin users.
- User deletion removes active access and preserves historical lead owner, creator, note, activity, follow-up, and report references.
- Sales Representative lead creation succeeds without choosing another owner.
- A Sales Representative-created lead records the current user as owner and creator.
- Sales Representatives see owned leads only.
- Managers see team-scoped leads, activities, follow-ups, and metrics only.
- Admins see global leads, activities, follow-ups, and metrics.
- Dashboard metrics include total leads, leads by representative, leads by team, leads by source, activity count, follow-up count, and last activity.
- Empty dashboard and lead list states are clear.
- Required audit records and domain events are created with sanitized payloads and correlation identifiers.

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

## Manual Acceptance Path

1. Sign in as the seeded Admin.
2. Open user management.
3. Create a Sales Representative with email, display name, password, and role.
4. Sign out and sign in as the new Sales Representative.
5. Open the dashboard and lead management pages.
6. Create a valid lead without selecting another owner.
7. Confirm the lead detail shows the representative as Created By and Owned By.
8. Attempt to view another representative's lead and confirm access is denied or hidden.
9. Sign in as a Manager and confirm only team leads and metrics are visible.
10. Sign in as Admin and confirm global leads and dashboard metrics are visible.
11. Delete the Sales Representative after confirmation.
12. Confirm the deleted user cannot sign in and historical lead owner/creator labels remain available to authorized users.
13. Attempt Admin self-deletion and last-active-admin removal and confirm both are blocked.
14. Review audit entries for user creation, login, deletion, blocked deletion, lead creation, ownership assignment, and denied visibility.

## Out Of Scope

- Email invitation delivery.
- Activation links or activation pages for new Admin-created users.
- Self-registration.
- Password reset redesign.
- AI features.
- Forecasting.
- Recommendations.
- WhatsApp automation.
- Executive analytics.
- Revenue attribution.
- Commission calculations.
- Advanced reporting beyond the operational metrics listed in this plan.
