# Web App

The web app contains the public product website, authentication entry points,
protected workspace shell, user/team administration, security audit review, and
lead management surfaces.

## Boundaries

- `app/page.tsx`: public CRM marketing landing page.
- `app/features/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`: public
  product information and non-persistent contact sales validation.
- `app/login/page.tsx`: active sign-in entry.
- `app/register/page.tsx`, `app/forgot-password/page.tsx`,
  `app/reset-password/page.tsx`: entry-only account lifecycle placeholders.
- `app/(protected)/layout.tsx`: protected workspace shell and navigation.
- `app/(protected)/dashboard/page.tsx`: dashboard placeholder destination.
- `app/(protected)/foundation/page.tsx`: protected foundation shell.
- `features/foundation`: clients and UI for foundation status, auth, and smoke jobs.
- `features/marketing`: public page content, layout, navigation, and contact
  form validation.
- `features/workspace`: protected workspace navigation, placeholders, and shared
  accessibility frame.

## Frontend Shell Routes

Public routes:

- `/`
- `/features`
- `/about`
- `/contact`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Protected workspace destinations:

- `/dashboard`
- `/leads`
- `/activities`
- `/exhibitions`
- `/deals`
- `/targets`
- `/analytics`
- `/notifications`
- `/team`
- `/settings`

Existing protected routes such as `/users`, `/teams`, `/audit`, and
`/foundation` remain available for implemented capabilities.

## Leads Core

Phase 2 adds protected lead management routes:

- `/leads`: lead list, create form, and pipeline filters.
- `/leads/[leadId]`: lead detail, source context, assignment, status, notes, and
  history panels.

Set `NEXT_PUBLIC_API_BASE_URL` to the API origin when it differs from
`http://localhost:3001`.

### Browser Validation

Run browser coverage after dependencies are installed. The frontend shell specs
use a Playwright-only auth bypass cookie for protected shell rendering; existing
business workflow specs still require the API, database, Redis, migrations, and
seed data when they exercise live CRM behavior:

```bash
pnpm --filter @crm/web test:e2e
```

The frontend shell specs cover public navigation, contact form validation,
protected denial, account lifecycle placeholders, workspace navigation, existing
module preservation, safe module placeholders, responsive layout, keyboard
focus, and semantic labels.

The Leads e2e specs in `tests/e2e/leads-*.e2e.ts` cover protected route access,
lead creation validation, duplicate and permission-denied states, assignment
controls, status pipeline actions, archive/restore feedback, notes, history, and
loading/empty/error states. The web UI should not expose restricted duplicate
details or hidden lead contact data.
