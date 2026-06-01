# Implementation Plan: CRM Front End

**Branch**: `004-crm-frontend` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-crm-frontend/spec.md`

## Summary

Deliver the CRM front-end product presence and application shell. The
implementation expands the current foundation page into a public marketing
website, keeps sign-in as the active authentication entry point, adds
entry-only account lifecycle placeholders, introduces a responsive protected
workspace navigation shell, preserves existing working protected CRM module
pages, adds placeholders only for modules not implemented yet, and validates the
core public/protected flows against WCAG 2.2 AA expectations. No new CRM
business workflows, persistence, domain events, analytics, notifications,
integrations, AI, lead creation side effects, or account lifecycle behavior are
introduced by this feature.

## Technical Context

**Language/Version**: TypeScript on Node.js 24 LTS

**Primary Dependencies**: Next.js App Router, React, TanStack Query, Tailwind CSS,
lucide-react, Zod, existing foundation auth client and protected layout patterns

**Storage**: N/A for new persistence. This feature does not add new database
tables or persisted contact sales records. It reuses the existing foundation
session/auth behavior for protected access.

**Testing**: Vitest for form validation and reusable UI logic; Playwright for
public navigation, protected route denial, sign-in shell access, responsive
navigation, placeholder pages, existing module preservation, and accessibility
smoke coverage; existing root build and CI verification

**Target Platform**: Browser web application running in the existing web app and
served with the existing API/session foundation in local and CI validation

**Project Type**: Web application frontend within the existing workspace

**Performance Goals**: Public landing content becomes usable within 3 seconds in
a normal local validation environment; authenticated users reach the protected
dashboard within 30 seconds from sign-in; public product, about, contact, and
protected workspace destinations are reachable in no more than 3 user actions
from their relevant entry point

**Constraints**: Preserve existing working protected pages for users, teams,
audit, foundation, and leads; add placeholders only for missing module
destinations; no new CRM business operations; no contact sales persistence;
protected content remains default-deny; English content only while keeping
layouts suitable for future right-to-left support; core public/protected flows
must satisfy WCAG 2.2 AA review targets

**Scale/Scope**: Public landing, features, about, and contact pages; sign-in plus
entry-only register, forgot-password, and reset-password placeholders; protected
workspace shell with dashboard and module destinations for leads, activities,
exhibitions, deals, targets, analytics, notifications, team, and settings;
focused frontend tests and UI contracts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **CRM capability boundary**: PASS. This feature delivers the single capability
  "front-end product presence and application shell." It presents planned Lead,
  Activity, Exhibition, Deal, Revenue, Target, Analytics, and Notification areas
  but does not implement new business workflows or mutate CRM aggregates.
- **Secure access control**: PASS. Public pages remain anonymous. Protected
  workspace destinations reuse the existing session gate and redirect anonymous
  users to sign in. Admin, Manager, and Sales Representative users may see the
  same shell unless later module specs narrow access. Contact sales input is
  validation-only and must not expose secrets, stack traces, customer data, lead
  details, revenue, commission data, notes, or audit metadata.
- **Test-first coverage**: PASS. Planning requires unit tests for contact form
  validation and navigation model behavior, browser tests for public pages,
  protected denial, sign-in shell access, responsive navigation, placeholder
  states, existing module preservation, and accessibility checks for core flows.
- **Auditable events**: PASS with N/A scope. This feature emits no new CRM
  domain events and creates no activity timeline entries because it is a
  presentation and navigation feature only. Existing foundation authentication
  and denied-access audit behavior remains in force.
- **Operational readiness**: PASS. Plan covers safe user-visible errors,
  no-migration scope, no new indexes or transactions, responsive and accessible
  UI states, build/test validation, and preservation of existing protected pages.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` preserve the capability boundary and do not add CRM business
logic, persistence, domain events, or account lifecycle workflows.

## Project Structure

### Documentation (this feature)

```text
specs/002-crm-frontend/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- ui-routes.md
|-- checklists/
|   `-- requirements.md
`-- spec.md
```

### Source Code (repository root)

```text
apps/
|-- web/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- features/
|   |   |   `-- page.tsx
|   |   |-- about/
|   |   |   `-- page.tsx
|   |   |-- contact/
|   |   |   `-- page.tsx
|   |   |-- login/
|   |   |   `-- page.tsx
|   |   |-- register/
|   |   |   `-- page.tsx
|   |   |-- forgot-password/
|   |   |   `-- page.tsx
|   |   |-- reset-password/
|   |   |   `-- page.tsx
|   |   `-- (protected)/
|   |       |-- layout.tsx
|   |       |-- dashboard/
|   |       |   `-- page.tsx
|   |       |-- leads/
|   |       |-- activities/
|   |       |-- exhibitions/
|   |       |-- deals/
|   |       |-- targets/
|   |       |-- analytics/
|   |       |-- notifications/
|   |       |-- team/
|   |       `-- settings/
|   |-- features/
|   |   |-- marketing/
|   |   |   |-- components/
|   |   |   `-- validation/
|   |   |-- workspace/
|   |   |   |-- components/
|   |   |   `-- navigation/
|   |   |-- foundation/
|   |   |-- users/
|   |   `-- leads/
|   `-- tests/
|       |-- e2e/
|       `-- frontend-shell/
|-- api/
|   `-- src/
|       `-- modules/
|           |-- auth/
|           `-- foundation/
packages/
|-- contracts/
`-- test-utils/
```

**Structure Decision**: Continue the existing `apps/web` frontend inside the
workspace. Add marketing and workspace shell code under `apps/web` while
preserving existing `features/foundation`, `features/users`, and
`features/leads` modules. Backend changes are limited to reusing existing auth
and protected-shell behavior; no new API module, database model, migration, or
queue is required.

## Complexity Tracking

No constitution violations identified. No exception is required.
