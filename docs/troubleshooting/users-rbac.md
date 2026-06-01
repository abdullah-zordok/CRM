# Users & RBAC Troubleshooting

## Activation Fails

Confirm the activation path has not expired or been revoked by a later resend.
Raw activation tokens are never stored, so only the user-facing setup path can be
used to complete activation.

## Access Still Works After Disablement

Check that active sessions for the user were revoked with `USER_DISABLED`.
Disabled users must be denied protected access before any user, team, role, or
audit action proceeds.

## Role Removal Does Not Take Effect

Verify the removed role was required for the protected action and that affected
sessions were revoked with `ROLE_REMOVED`.

## Audit Search Is Empty

Generate user, role, team, session, activation, audit-view, or denied-access
activity, then search by actor, target, event type, outcome, or date range.
