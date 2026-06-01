# Quickstart: CRM Front End

## Prerequisites

- Node.js 24 LTS
- pnpm 10.x through Corepack or local installation
- Existing project dependencies installed
- Existing API/session foundation available for protected-route validation

## Local Setup

1. Install dependencies from the repository root:

   ```powershell
   pnpm install --frozen-lockfile=false
   ```

2. Build the workspace:

   ```powershell
   pnpm build
   ```

3. Start the API in one terminal when protected auth behavior is needed:

   ```powershell
   pnpm --filter @crm/api dev
   ```

4. Start the web app in another terminal:

   ```powershell
   pnpm --filter @crm/web dev
   ```

5. Open the web app at the configured local web URL, normally:

   ```text
   http://localhost:3000
   ```

## Manual Validation

1. Public website:
   - Open `/`.
   - Confirm product identity, target audience, value proposition, and contact
     sales action are visible.
   - Navigate to `/features`, `/about`, and `/contact` in no more than 3 user
     actions each.

2. Contact sales form:
   - Open `/contact`.
   - Submit empty fields and confirm required-field validation.
   - Enter malformed email and confirm email validation.
   - Enter valid-looking details and confirm a non-persistent success message.

3. Account lifecycle placeholders:
   - Open `/register`, `/forgot-password`, and `/reset-password`.
   - Confirm each screen clearly states that the flow is unavailable in this
     phase and does not alter accounts or sessions.

4. Protected access:
   - While signed out, open `/dashboard` and other protected destinations.
   - Confirm protected content is denied and the user is directed to sign in.
   - Sign in with the seeded or configured authorized user.
   - Confirm the protected workspace shell and dashboard destination are
     available.

5. Workspace navigation:
   - Confirm dashboard, leads, activities, exhibitions, deals, targets,
     analytics, notifications, team, and settings are reachable from workspace
     navigation.
   - Confirm existing working protected pages, especially leads and current
     admin/user pages, are preserved.
   - Confirm missing modules show placeholder states without live business
     actions.

6. Responsive and accessibility review:
   - Review public pages and workspace navigation at desktop, tablet, and
     mobile-sized widths.
   - Confirm keyboard navigation, visible focus, labels, contrast, validation
     feedback, and unavailable states satisfy WCAG 2.2 AA expectations for core
     flows.
   - Confirm layout choices do not depend on English-only positioning that would
     block future right-to-left support.

## Automated Verification

Run focused web tests:

```powershell
pnpm --filter @crm/web test:unit
pnpm --filter @crm/web test:e2e
```

Run full workspace verification before acceptance:

```powershell
pnpm build
pnpm ci:verify
```

## Acceptance Evidence

- Public pages are navigable and readable.
- Contact form validation works without persistence.
- Account lifecycle placeholders do not change user state.
- Protected routes deny anonymous access.
- Authorized users can reach the protected workspace shell.
- Workspace navigation includes every planned destination.
- Existing working protected module pages are not replaced.
- Placeholder modules expose no sensitive CRM data or unfinished actions.
- Core public and protected flows pass WCAG 2.2 AA review.

## Implementation Notes

- Implemented route behavior matches `contracts/ui-routes.md`; no intentional route deviations were added.
