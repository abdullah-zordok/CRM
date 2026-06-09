# User and Lead Recovery Troubleshooting

## New User Cannot Sign In

Check that the user has `status = ACTIVE`, `isDeleted = false`, and a non-empty `passwordHash`. Admin-created users do not require activation links in this recovery workflow.

If login still fails, verify the submitted password meets the API schema, the email is normalized, and old sessions were not reused after a lifecycle change.

## Lead Creation Says No Eligible Owner

For Sales Representatives, the current user should be used as both owner and creator. Confirm the signed-in user is active, not deleted, and has the `SALES_REPRESENTATIVE` role.

For Admin or Manager assignment flows, confirm the selected owner is active and in the expected team scope.

## User Delete or Disable Is Blocked

Self-delete and self-disable are blocked. Removing the last active Admin is also blocked. Create or reactivate another Admin before disabling or deleting the current final Admin.

Deleted users are intentionally retained for historical lead, activity, follow-up, audit, and event references.

## Dashboard Metrics Are Empty or Denied

Admins should receive global metrics. Managers receive metrics only for their active team. Managers without a team receive a valid empty scoped response.

Sales Representatives are denied management dashboard metrics unless a later permission explicitly grants access.

## Visibility Looks Too Narrow

Sales Representatives see owned leads only. Managers see leads tied to their active team. Admins see all leads. Check owner and team fields on the lead before changing UI filters.

Activity and follow-up visibility should match the parent lead scope.
