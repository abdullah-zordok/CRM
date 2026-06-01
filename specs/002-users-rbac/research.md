# Research: Users & RBAC

## Decision: Extend the Phase 0 modular monolith users/auth foundation

**Rationale**: The constitution and Phase 0 plan already establish a single
workspace, modular backend, protected browser shell, persisted identity,
sessions, role categories, and security audit records. Extending that model
avoids duplicate identity systems and preserves the seeded Admin migration path.

**Alternatives considered**:
- Separate identity service: rejected because Phase 1 scope does not require
  service isolation and would add operational complexity.
- Frontend-only administration shell: rejected because protected actions must be
  enforced at the server boundary.

## Decision: Fixed Phase 1 business roles with a non-editable permission matrix

**Rationale**: Admin, Manager, and Sales Representative are required by the
constitution and Phase 0 foundation. A fixed matrix keeps acceptance tests clear,
supports default-deny behavior, and avoids premature custom-role UX/data design
before CRM business modules introduce more specific needs.

**Alternatives considered**:
- Custom roles in Phase 1: rejected because it expands scope and creates
  unresolved permission governance questions.
- Editable permissions on baseline roles: rejected because it weakens
  predictable test coverage for future CRM modules.

## Decision: Treat Operations Reviewer as a read-only access profile

**Rationale**: Audit review should be available without granting user, role,
team, or session administration. Keeping this profile read-only and audit-only
supports separation of duties while avoiding full custom-role support.

**Alternatives considered**:
- Admin-only audit review: rejected because the clarified spec requires a
  read-only reviewer path.
- Fourth business role: rejected because Operations Reviewer is not a sales
  operations role and must not affect future CRM ownership rules.

## Decision: Time-limited activation for new user credential setup

**Rationale**: Admins should not handle raw passwords. A time-limited activation
flow supports secure onboarding, auditability, expiration handling, and repeat
invitation behavior without exposing credentials.

**Alternatives considered**:
- Admin-set temporary password: rejected because it increases credential
  handling risk.
- Self-registration approval: rejected because this is an internal CRM platform
  and Admin-created access is the clearer control point.
- Deferring credential setup: rejected because user creation cannot be validated
  end-to-end.

## Decision: Immediate affected-session revocation after disablement or required role removal

**Rationale**: Phase 1 manages access control, so removed access must take effect
before further protected operations are allowed. Revocation gives deterministic
security behavior and clear integration tests.

**Alternatives considered**:
- Re-check permissions while keeping sessions active: rejected because it keeps
  stale sessions valid and complicates denial semantics.
- Let sessions expire naturally: rejected because it conflicts with
  secure-by-default access control.

## Decision: One active team per user with membership history

**Rationale**: Future CRM scoping needs deterministic owner/manager/team
visibility. One active team per user keeps permission decisions simple while
history preserves audit and future reporting context.

**Alternatives considered**:
- Multiple active teams per user: rejected because it creates ambiguous future
  ownership and manager visibility rules.
- Manager relationship only: rejected because teams are needed for future CRM
  scoping.

## Decision: Searchable audit review without export in Phase 1

**Rationale**: The spec requires in-app traceability for security-sensitive user
and RBAC changes. Export introduces compliance, redaction, and file lifecycle
requirements better handled after business audit needs mature.

**Alternatives considered**:
- CSV export now: rejected as unnecessary for Phase 1 acceptance.
- Store audit only with no review surface: rejected because it prevents the
  operations reviewer path from being validated.

## Decision: Record administration/security events, not CRM business events

**Rationale**: User and RBAC changes are security-significant and should be
traceable with correlation identifiers and idempotency where repeated
submissions can occur. The feature must not emit lead/deal/revenue business
events before those aggregates exist.

**Alternatives considered**:
- No events beyond audit records: rejected because future notification and
  analytics readiness depends on stable administration signals.
- Full business event catalog: rejected as later-phase CRM scope.
