# Users & RBAC Security Notes

Phase 1 implements fixed business roles, read-only operations reviewer access,
default-deny permission checks, one active team per user, activation-based
credential setup, immediate session revocation after access removal, and
sanitized audit records.

Protected actions must map to the fixed permission matrix in
`apps/api/src/modules/users/permissions/permission-codes.ts`. Custom roles,
editable permissions, multiple active teams, audit export, and CRM business
records are out of scope for this phase.

Audit metadata must not include raw passwords, activation tokens, session
tokens, secrets, stack traces, or credentials.
