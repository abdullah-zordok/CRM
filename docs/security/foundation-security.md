# Foundation Security

Phase 0 uses a default-deny posture for protected areas.

Security controls:

- Raw passwords and raw session tokens are never persisted.
- Browser session state uses an HttpOnly cookie.
- Safe errors avoid stack traces, credentials, and connection strings.
- Audit records are created for login, logout, and denied access.
- Request correlation links logs, audit records, and background job status.
- Secrets are read from environment variables and are excluded from Git.

Full user management, permission administration, and audit browsing belong to
Phase 1.
