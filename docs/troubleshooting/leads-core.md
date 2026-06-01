# Leads Core Troubleshooting

## Duplicate Conflicts

Active leads are unique by normalized email and normalized phone across the
platform. If a duplicate belongs outside the user's scope, the API returns a
privacy-safe conflict without exposing the restricted lead.

Check:

- The submitted email is lowercase-normalized and the phone uses the same
  normalization path as `LeadDuplicateService`.
- Archived leads are excluded from active uniqueness checks.
- The response uses `restrictedMatch: true` when the existing lead is outside the
  actor's scope.
- No owner, team, contact, note, or budget data is present in restricted duplicate
  responses.

## Permission Denials

Lead access is default deny. Admins have global scope, Managers have current team
scope, and Sales Representatives have owned lead scope. Check the user's active
roles, team membership, and the relevant `LeadAccessDecision` row.

Common causes:

- The user session is missing or expired.
- The role lacks the action permission such as lead create, assign, change
  status, add note, view history, or search.
- A Manager is trying to act outside current team scope.
- A Sales Representative is trying to assign to another user or view a lead they
  do not own.
- The assignee is disabled, inactive, or not eligible for lead ownership.

## Stale Updates

Assignment, status, and note writes require the current lead `version`. Reload
the lead detail and retry when a `LEAD_STALE_UPDATE` response is returned.

If conflicts are unexpected, compare the client payload version with the latest
lead row and recent history entries. Successful writes must increment the lead
version inside the same transaction that records history, audit, and domain event
metadata.

## Search Scale

Lead search is bounded by `pageSize <= 100` and uses scoped filters for status,
source, priority, owner, team, exhibition text, and free-text matching. Validate
large local datasets with `pnpm --filter @crm/api test:integration`.

For slow searches:

- Confirm the Leads Core migration has applied the status, source, priority,
  owner, team, date, version, and text-search supporting indexes.
- Keep filters scoped before pagination so hidden leads do not affect result
  counts.
- Re-run `pnpm verify:leads-core` after changing repository query shape.
- Use the 10,000 active-lead integration path to catch regressions before CI.
