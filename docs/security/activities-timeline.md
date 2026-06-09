# Activities Timeline Security Notes

The activities timeline is a protected Phase 3 capability under the existing CRM
session, RBAC, team scope, audit, and lead access controls.

## Access Model

- Admin users can create, read, search, and manage activities across the
  workspace.
- Manager users are limited to leads and activity owners in their active team.
- Sales representatives are limited to owned leads and their own follow-up
  ownership.
- Denied create, read, search, and state-change attempts return generic
  permission errors and emit sanitized audit records.

## Data Handling

- Activity notes are rejected when they contain obvious sensitive payment,
  credential, or secret material.
- Timeline and workspace DTOs expose note previews instead of unbounded note
  copies.
- Lead detail links preserve filter context with encoded query values so nested
  activity filters do not leak into unrelated route parameters.

## State Changes

- Planned follow-ups require optimistic version checks before complete,
  reassign, or cancel operations.
- Completed and canceled activities are immutable through follow-up state
  endpoints.
- New follow-ups cannot be scheduled for archived leads.
- Each accepted state change emits both an activity audit entry and a lead domain
  event with the request correlation id.

## Review Points

- Keep new activity fields out of audit metadata unless they are necessary for
  security investigation.
- Preserve generic denial messages for cross-team, missing-role, and missing-lead
  cases.
- Re-run contract, unit, integration, and browser checks after changing RBAC,
  lead ownership, team membership, or activity DTO mappings.
