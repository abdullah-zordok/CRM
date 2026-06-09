# Activities Timeline Troubleshooting

Use this checklist when activity creation, follow-up actions, or the activity
workspace behave unexpectedly.

## Missing Or Empty Activity Results

- Confirm the signed-in user has the expected role and active team.
- Confirm the lead is owned by the user or belongs to the manager's active team.
- Check whether filters on `/activities` include a restrictive due state, owner,
  status, type, or date range.
- Run `pnpm verify:activities-timeline` to confirm contract wiring still includes
  the activity paths and events.

## Follow-Up Action Fails

- A 412 response means the follow-up version changed after the page loaded.
  Refresh the timeline and retry with the latest activity version.
- A 409 response usually means the activity is no longer planned, the lead is
  archived, or the requested transition is invalid.
- A 403 response means the user is outside the permitted role, owner, or team
  scope.

## Prisma Or Migration Issues

- Regenerate Prisma types after schema changes:

  ```bash
  pnpm --filter @crm/api exec prisma generate
  ```

- Apply migrations and seed data before running workflow tests:

  ```bash
  pnpm --filter @crm/api exec prisma migrate deploy
  pnpm --filter @crm/api exec prisma db seed
  ```

## Browser Test Failures

- Start PostgreSQL, Redis, API, and web app before running CRM workflow e2e
  specs.
- Verify `NEXT_PUBLIC_API_BASE_URL` points to the API origin used by Playwright.
- Re-run `pnpm --filter @crm/web test:unit` first when the failure is isolated
  to validation, query serialization, or client behavior.
