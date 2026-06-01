# UI Route Contract: CRM Front End

This contract defines user-visible routes and states for the CRM front-end
feature. It is a UI contract, not a backend API contract. No new backend
endpoints are introduced by this feature.

## Public Routes

| Route | Audience | Required State | Acceptance |
|-------|----------|----------------|------------|
| `/` | Anonymous visitor | Public landing page | Product identity, audience, value proposition, and contact sales action are visible. |
| `/features` | Anonymous visitor | Public features page | Lead tracking, activities, exhibitions, deals and revenue, targets and commissions, analytics, and notifications are presented as platform areas. |
| `/about` | Anonymous visitor | Public about page | Product vision, mission, and platform philosophy are visible. |
| `/contact` | Anonymous visitor | Contact sales page | Name, company, email, phone, and message fields are available with validation and non-persistent confirmation. |
| `/login` | Anonymous visitor | Active sign-in page | Existing sign-in behavior remains available. |
| `/register` | Anonymous visitor | Entry-only unavailable placeholder | No account is created; clear unavailable state is shown. |
| `/forgot-password` | Anonymous visitor | Entry-only unavailable placeholder | No reset request is created; clear unavailable state is shown. |
| `/reset-password` | Anonymous visitor | Entry-only unavailable placeholder | No password is changed; clear unavailable state is shown. |

## Protected Routes

All protected routes require an authenticated session. Anonymous requests must
redirect to sign-in or otherwise deny protected content without exposing CRM
data.

| Route | Required State | Preservation Rule |
|-------|----------------|-------------------|
| `/dashboard` | Workspace dashboard destination | Add if missing; may be a dashboard placeholder. |
| `/leads` | Working leads page if already implemented | Preserve existing working behavior. |
| `/leads/[leadId]` | Working lead detail page if already implemented | Preserve existing working behavior. |
| `/activities` | Placeholder module page unless implemented elsewhere | No live activity operations. |
| `/exhibitions` | Placeholder module page unless implemented elsewhere | No live exhibition operations. |
| `/deals` | Placeholder module page unless implemented elsewhere | No live deal or revenue operations. |
| `/targets` | Placeholder module page unless implemented elsewhere | No live target or commission operations. |
| `/analytics` | Placeholder module page unless implemented elsewhere | No live analytics calculations. |
| `/notifications` | Placeholder module page unless implemented elsewhere | No live notification operations. |
| `/team` | Existing teams page or placeholder depending on current app route | Preserve existing working team behavior when present. |
| `/settings` | Placeholder module page unless implemented elsewhere | No account lifecycle or system settings changes. |

Existing protected destinations such as `/users`, `/teams`, `/audit`, and
`/foundation` may remain available for current implemented capabilities. This
feature must not remove or replace them.

## Navigation Contract

- Public navigation must include access to landing, features, about, contact,
  and sign-in.
- Workspace navigation must include dashboard, leads, activities, exhibitions,
  deals, targets, analytics, notifications, team, and settings.
- Workspace header must include user menu, company switcher, and notifications
  placeholder states where full behavior is not implemented.
- Navigation must adapt for desktop, tablet, and mobile-sized screens without
  losing keyboard access or visible focus.
- Layout must avoid left-only assumptions that would block future right-to-left
  support.

## State Contract

| State | Required Behavior |
|-------|-------------------|
| Public | Anonymous visitor can view content and navigate public pages. |
| Authenticated | User can enter protected workspace and navigate protected destinations. |
| Denied | Anonymous or invalid-session user cannot view protected content. |
| Placeholder | Page identifies the module and shows unavailable state without live actions. |
| Validation Error | Contact form identifies missing or malformed fields before confirmation. |
| Confirmation | Contact form shows non-persistent confirmation without claiming CRM record creation. |
| Responsive | Navigation and content remain readable on desktop, tablet, and mobile-sized screens. |
| Accessible | Core flows meet WCAG 2.2 AA expectations for keyboard navigation, labels, focus, contrast, and status feedback. |

## Non-Goals

- No new backend API contract.
- No contact sales persistence.
- No user registration, activation, password reset, or password change behavior.
- No new CRM business workflows.
- No new domain events, background jobs, migrations, or persisted audit records
  beyond existing auth/foundation behavior.
