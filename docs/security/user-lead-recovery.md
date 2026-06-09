# User and Lead Recovery Security Notes

User and Lead Recovery makes Admin-created users login-ready, restores safe user lifecycle actions, assigns Sales Representative-created leads to the current representative, and exposes scoped operational dashboard metrics.

## Credentials and Login

- Admin-created users require an initial password and are saved as `ACTIVE`.
- Passwords are hashed before persistence and are never returned in user DTOs, audit metadata, events, or logs.
- Login uses a safe denial response for invalid credentials, disabled users, deleted users, and missing credential hashes.
- Session validation rejects disabled or deleted users even when an old session token is presented.

## Lifecycle Controls

- User deletion is a soft delete. The account is disabled, marked deleted, and removed from active lists.
- Historical lead owner, creator, activity, follow-up, audit, and event references are preserved.
- Self-disable, self-delete, and last-active-admin removal are blocked by service-level checks.
- Active sessions for disabled or deleted users are revoked and audited.

## Lead Ownership and Visibility

- Sales Representatives create leads owned and created by their own user id.
- Representative owner overrides are ignored or denied unless a separate permission grants assignment.
- Admins can read all lead records. Managers can read team-scoped leads. Sales Representatives can read owned leads only.
- Activity and follow-up reads use the same ownership and team scope as lead reads.
- Denied lead visibility uses privacy-safe forbidden or not-found behavior and records denial metadata without hidden customer details.

## Dashboard Scope

- Admin dashboard metrics use global scope.
- Manager dashboard metrics use active team scope and return empty groups when no team is assigned.
- Sales Representatives are denied management dashboard metrics by default.
- Dashboard access is audited and emits `DashboardMetricsViewed` with sanitized payloads.

## Audits and Events

Required recovery paths create sanitized audit records and domain events for user creation, activation, login outcome, deletion, blocked deletion, lead creation, ownership assignment, visibility denial, note/follow-up additions, and dashboard metric access.
