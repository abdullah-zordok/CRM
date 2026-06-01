# Feature Specification: Users & RBAC

**Feature Branch**: `002-users-rbac`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "read plan.md and create a specification for the Phase 1 - Users & RBAC"

## Clarifications

### Session 2026-05-31

- Q: How should new users complete initial credential setup? -> A: Admin creates/invites user and the user completes setup through a time-limited activation link or equivalent secure setup flow.
- Q: Should Phase 1 allow custom roles or editable role permissions? -> A: Fixed business roles only: Admin, Manager, and Sales Representative with a defined permission matrix; no custom roles or editable role permissions.
- Q: How many active teams can a user belong to in Phase 1? -> A: Each user has one active team at a time, with optional history of prior teams.
- Q: What should happen to active sessions after a user is disabled or loses required role access? -> A: Immediately revoke affected active sessions after disablement or role removal.
- Q: Who can review Phase 1 security audit activity? -> A: Searchable audit review is visible to Admins and a read-only operations reviewer access profile.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Platform Users (Priority: P1)

As an administrator, I need to invite, create, update, disable, and review CRM
platform users so access to operational data is controlled from a single
administrative area.

**Why this priority**: Phase 0 only proves login with a seeded Admin. The CRM
cannot safely introduce leads, deals, targets, revenue, or activity workflows
until administrators can manage real user identities and remove access when
people change roles or leave the organization.

**Independent Test**: Can be tested by signing in as an Admin, creating a new
user with required profile details, assigning an initial role, confirming the
user appears in the user list, editing the user's profile, disabling the user,
and verifying the disabled user cannot access protected areas.

**Acceptance Scenarios**:

1. **Given** an authenticated Admin is on the user management area, **When**
   they create a user with valid required details and at least one role, **Then**
   the user is saved, visible in the user list, and receives a time-limited
   activation path for completing credential setup.
2. **Given** an authenticated Admin edits an existing active user, **When** they
   update profile details or status, **Then** the latest values are visible to
   administrators and the access status takes effect immediately.
3. **Given** an Admin disables a user, **When** that user attempts to access a
   protected operational area, **Then** affected active sessions are revoked,
   access is denied, and the denial is recorded for audit review.
4. **Given** a user email already exists, **When** an Admin attempts to create
   another user with the same email, **Then** the system prevents the duplicate
   and explains the conflict without exposing sensitive details.

---

### User Story 2 - Assign Roles And Permissions (Priority: P1)

As an administrator, I need to assign fixed baseline roles and review permission
rules so each user receives only the level of access required for their sales
operations responsibilities.

**Why this priority**: Later CRM capabilities will rely on role and permission
decisions. The Admin, Manager, and Sales Representative categories introduced in
Phase 0 must become enforceable permission profiles before customer and revenue
data are introduced.

**Independent Test**: Can be tested by assigning Admin, Manager, and Sales
Representative roles to separate users, attempting role-protected actions as
each user, and confirming allowed and denied outcomes match the documented
   permission matrix.

**Acceptance Scenarios**:

1. **Given** an Admin assigns a role to a user, **When** the user accesses a
   role-protected area, **Then** access is allowed only for permissions granted
   to that role.
2. **Given** a user has no role granting an attempted action, **When** they try
   the action, **Then** the system denies access by default and records the
   denied decision.
3. **Given** an Admin changes a user's roles, **When** the user next attempts a
   protected action, **Then** sessions affected by removed access are revoked and
   the newest role assignment is used for the access decision.
4. **Given** an Admin attempts to remove the final active Admin role from the
   platform, **When** the change is submitted, **Then** the system blocks the
   change to prevent administrative lockout.

---

### User Story 3 - Manage Team Scope (Priority: P2)

As a sales operations manager, I need users to be organized into teams and
manager relationships so future CRM records can be scoped to owners, managers,
and teams.

**Why this priority**: Managers need visibility across their teams while sales
representatives should only see their own assigned work unless explicitly
permitted. Team scope is required before later lead, deal, target, and activity
features can enforce ownership correctly.

**Independent Test**: Can be tested by creating a team, assigning a manager and
sales representatives, viewing team membership as an Admin or Manager, and
confirming users outside the team cannot manage that team unless their role
allows it.

**Acceptance Scenarios**:

1. **Given** an Admin creates a team, **When** they assign a Manager and Sales
   Representatives to it, **Then** each assigned user has one active team and
   the membership is visible for future CRM access scoping.
2. **Given** a Manager views team users, **When** the Manager belongs to or leads
   the team, **Then** they can view appropriate team membership without receiving
   unrestricted administrator privileges.
3. **Given** a Sales Representative attempts to manage another user's team
   assignment, **When** they submit the change, **Then** the system denies the
   action and records the denied decision.

---

### User Story 4 - Review Security Audit Activity (Priority: P2)

As an administrator or read-only operations reviewer, I need to review user and
permission audit activity so security-sensitive changes and access denials are
traceable without granting user-management privileges.

**Why this priority**: User and permission administration changes are high-risk.
The organization needs accountability before CRM business modules begin storing
customer, revenue, commission, or activity data.

**Independent Test**: Can be tested by performing user creation, role change,
status change, team assignment, login, logout, and denied access actions, then
confirming an authorized reviewer can find audit entries with actor, outcome,
affected user, timestamp, and sanitized context.

**Acceptance Scenarios**:

1. **Given** an Admin changes a user's roles or status, **When** the change is
   saved, **Then** an audit record identifies the actor, affected user, action,
   outcome, timestamp, and sanitized context.
2. **Given** an Admin or read-only operations reviewer filters audit activity by
   user, action type, or date range, **When** matching records exist, **Then**
   the reviewer can view the results without seeing passwords, raw tokens,
   secrets, stack traces, or user-management controls.
3. **Given** an unauthorized user attempts to view audit activity, **When** they
   open the audit review area, **Then** access is denied and the denial is
   recorded.

### Edge Cases

- What happens when an Admin attempts to create a user without required identity,
  role, or status details?
- What happens when a user's activation path expires before credential setup is
  completed?
- What happens when the only active Admin account is disabled or loses the Admin
  role?
- How does the system handle users assigned to disabled roles or inactive teams?
- What happens when a disabled user still has an active session?
- How does the system handle role changes while a user is already signed in?
- What happens when an Admin attempts to create duplicate teams, duplicate role
  assignments, or duplicate user email addresses?
- What happens when an Admin moves a user from one team to another while future
  CRM scoping history must remain traceable?
- How does the system prevent unauthorized users from discovering sensitive user
  or audit details through error messages?

## CRM & Security Considerations *(mandatory)*

- **Business Capability**: Secure user administration and role-based access
  control for CRM and sales operations users.
- **Affected CRM Data**: User identity, role assignments, active team membership,
  manager relationships, access decisions, and security audit records. Phase 1
  does not create or manage lead, activity, follow-up, deal, revenue, target,
  exhibition, analytics, notification, WhatsApp, AI, or mobile-specific business
  records.
- **Roles & Permissions**: Admin users can manage users, roles, teams, and audit
  review through a fixed Phase 1 permission matrix. Phase 1 business roles are
  limited to Admin, Manager, and Sales Representative; custom roles and editable
  role permissions are out of scope. Phase 1 also includes a read-only operations
  reviewer access profile for searchable audit review only. Managers can view
  team-scoped user information needed for future team operations but cannot grant
  Admin access or bypass restrictions. Sales Representatives can access only
  their own profile and permitted protected areas. All protected actions deny by
  default unless active access grants the permission.
- **Audit & Activity Trail**: User creation, profile update, status change, role
  assignment, role removal, team assignment, login, logout, session revocation,
  audit review, and denied access must produce security audit records with
  sanitized metadata. Audit records must be reviewable by authorized roles and
  must not be editable through normal user workflows.
- **Domain Events**: Security and administration events should be recorded for
  future notification, analytics, and compliance workflows. Events must include
  correlation identifiers and idempotency protection for repeated administrative
  submissions. Phase 1 does not emit CRM business events such as lead assignment
  or deal closure.
- **Security Controls**: User input must be validated, passwords and tokens must
  never be stored or displayed in raw form, initial credential setup must use a
  time-limited activation path, affected active sessions must be revoked when
  users are disabled or lose required role access, sensitive errors must be
  sanitized, audit metadata must redact secrets, and administrative lockout must
  be prevented.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Admin users to create platform users with a
  unique email, display name, active or disabled status, and at least one initial
  role.
- **FR-001a**: System MUST provide a time-limited activation path or equivalent
  secure setup flow for newly created users to complete initial credential setup
  without exposing raw passwords to administrators.
- **FR-002**: System MUST validate user identity fields before saving and MUST
  prevent duplicate email addresses.
- **FR-003**: System MUST allow Admin users to view, search, filter, and sort the
  user list by identity, role, status, team, and creation or update date.
- **FR-004**: System MUST allow Admin users to update user profile details that
  are required for access administration.
- **FR-005**: System MUST allow Admin users to disable and re-enable users.
- **FR-006**: System MUST deny protected access for disabled users, including
  users who were disabled after a prior successful sign-in.
- **FR-006a**: System MUST immediately revoke affected active sessions when a
  user is disabled.
- **FR-007**: System MUST support Admin, Manager, and Sales Representative as the
  fixed business role set for Phase 1.
- **FR-007a**: System MUST support a read-only operations reviewer access profile
  for audit review only and MUST NOT allow that profile to manage users, roles,
  teams, or sessions.
- **FR-008**: System MUST allow Admin users to assign and remove roles for users,
  subject to administrative lockout protection.
- **FR-009**: System MUST prevent the platform from having zero active users with
  the Admin role.
- **FR-010**: System MUST define a permission matrix that maps each protected
  user-management, role-management, team-management, profile, and audit-review
  action to allowed roles.
- **FR-010a**: System MUST NOT allow administrators to create custom roles or
  edit the permissions attached to the fixed Phase 1 roles.
- **FR-011**: System MUST enforce permission decisions consistently for every
  protected action and MUST deny access when no active role grants permission.
- **FR-012**: System MUST apply role changes to future access decisions without
  requiring administrators to restart the platform.
- **FR-012a**: System MUST immediately revoke active sessions affected by role
  removal when the removed role was required for protected access.
- **FR-013**: System MUST allow Admin users to create, update, deactivate, and
  view teams used for sales operations scoping.
- **FR-014**: System MUST allow Admin users to assign each user to no more than
  one active team at a time and identify a Manager relationship for team-scoped
  access.
- **FR-014a**: System SHOULD retain prior team membership history when a user is
  moved between teams so future audit and CRM scoping reviews can understand the
  change.
- **FR-015**: System MUST allow Managers to view user information for their team
  scope when permitted by the Phase 1 permission matrix.
- **FR-016**: System MUST prevent Managers and Sales Representatives from
  granting themselves broader permissions.
- **FR-017**: System MUST allow users to view their own profile and role summary
  without exposing administrative controls they are not allowed to use.
- **FR-018**: System MUST record security audit entries for user creation,
  profile update, status changes, role changes, team changes, login, logout,
  session revocation, audit review, and denied access.
- **FR-019**: System MUST allow authorized users to search and filter security
  audit records by actor, affected user, action type, outcome, and date range.
- **FR-019a**: System MUST make searchable audit review available to Admins and
  read-only operations reviewers, with no audit export workflow required in
  Phase 1.
- **FR-020**: System MUST redact passwords, raw session tokens, secrets, and stack
  traces from user-visible responses and audit metadata.
- **FR-021**: System MUST preserve existing Phase 0 seeded Admin access by
  migrating it into the Phase 1 user and role model.
- **FR-022**: System MUST keep Phase 1 limited to users, roles, permissions,
  teams, sessions, and security audit review, and MUST NOT implement lead, deal,
  revenue, commission, target, exhibition, WhatsApp, AI, notification, analytics,
  or mobile-specific workflows.

### Key Entities *(include if feature involves data)*

- **Platform User**: A person who can authenticate to the CRM platform; includes
  identity details, status, assigned roles, team membership, and timestamps.
- **Business Role**: A fixed Phase 1 sales operations access category: Admin,
  Manager, or Sales Representative.
- **Operations Reviewer Access Profile**: A read-only access profile that can
  search and view security audit activity but cannot manage users, roles, teams,
  sessions, or CRM business records.
- **Permission**: A named action allowed or denied by the fixed Phase 1
  permission matrix, such as managing users, assigning roles, managing teams,
  viewing audit activity, or viewing own profile.
- **Role Assignment**: The relationship between a Platform User and a Business
  Role, including who assigned it and when.
- **Team**: A sales operations grouping used to scope future CRM visibility and
  management responsibilities.
- **Team Membership**: The relationship between a Platform User and a Team,
  limited to one active team per user in Phase 1, with prior membership history
  retained where available.
- **Access Decision**: The allow or deny result for a protected user, role, team,
  profile, or audit action.
- **Session**: The authenticated access state for a Platform User, including
  whether it is active, revoked, or expired; sessions affected by user
  disablement or role removal are revoked immediately.
- **Activation**: A time-limited setup path that lets a newly created Platform
  User complete initial credential setup before accessing protected areas.
- **Security Audit Record**: An append-only record of security-sensitive user,
  role, team, session, audit review, and access activity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can create a new active user with an assigned role in
  under 2 minutes during acceptance testing.
- **SC-002**: 100% of protected user-management, role-management,
  team-management, profile, and audit-review actions enforce the Phase 1
  permission matrix.
- **SC-003**: 100% of disabled users are denied protected access immediately
  after their disabled status is saved.
- **SC-003a**: 100% of sessions affected by user disablement or required role
  removal are revoked during acceptance testing before further protected access
  is allowed.
- **SC-004**: The platform always retains at least one active Admin user during
  role and status management acceptance tests.
- **SC-005**: An Admin or read-only operations reviewer can find audit records
  for user, role, team, session, and denied-access activity within 30 seconds
  using available filters.
- **SC-006**: Audit validation confirms that 100% of required security-sensitive
  actions produce audit records with actor, affected user or resource, action,
  outcome, timestamp, and sanitized context.
- **SC-007**: Managers can view team-scoped user information for their team while
  Sales Representatives cannot manage other users or grant permissions.
- **SC-008**: 95% of administrative user searches and filters show matching
  results within 2 seconds in a normal local validation environment.
- **SC-009**: Reviewers can identify Phase 1 scope boundaries and excluded CRM
  business modules within 5 minutes of reading the specification.

## Assumptions

- Phase 1 builds on the Phase 0 foundation, including login/logout, protected
  shell, baseline roles, sessions or auth state, security audit records,
  structured logging, and default-deny access behavior.
- The seeded Phase 0 Admin becomes the initial active Admin in the Phase 1 user
  management model.
- Admin, Manager, and Sales Representative are the complete Phase 1 business
  role set; custom role creation and editable role permissions are deferred to
  later phases. A separate read-only operations reviewer access profile exists
  only for searchable audit review.
- Team hierarchy in Phase 1 is limited to one active team membership per user
  and manager relationships needed for future CRM scoping; sales territories,
  quotas, commissions, org charts, and approval chains are outside this phase.
- User invitation and initial credential setup use a time-limited activation
  path or equivalent secure setup flow; administrators do not handle raw user
  passwords.
- CRM business records and workflows remain out of scope until later phases use
  the Phase 1 user, role, and team model for access control.
