# Feature Specification: User and Lead Recovery

**Feature Branch**: `007-user-lead-recovery`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "Read Problem Users.md and create the specification for all phases covering user authentication completion, immediate activation, safe user lifecycle management, lead ownership, role-scoped visibility, and dashboard accountability metrics."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Creates Login-Ready Users (Priority: P1)

An Admin creates a Sales Representative, Manager, or Admin account with permanent login credentials so the new user can access the CRM immediately without an invitation, activation email, or separate registration workflow.

**Why this priority**: Created users are currently unusable, which blocks every sales workflow that depends on non-admin users.

**Independent Test**: Can be fully tested by creating a Sales Representative, signing in with the assigned credentials, and confirming the user reaches permitted CRM pages.

**Acceptance Scenarios**:

1. **Given** an Admin is on the user creation form, **When** the Admin submits a valid email, display name, role, and password, **Then** the user is created as active and can sign in immediately.
2. **Given** a newly created Sales Representative has signed in, **When** they open the dashboard and lead management pages, **Then** they can access the pages allowed for their role.
3. **Given** a user enters invalid credentials or belongs to a disabled/deleted account, **When** they attempt to sign in, **Then** access is denied with a safe message that does not expose credential or account details.

---

### User Story 2 - Sales Representative Creates Owned Leads (Priority: P1)

A Sales Representative creates a lead and the CRM automatically records that representative as both the lead owner and creator, removing the current "Eligible lead owner not found" failure.

**Why this priority**: Lead capture is the core operational workflow. Without successful lead creation and ownership, the CRM has no practical sales value.

**Independent Test**: Can be fully tested by signing in as a Sales Representative, creating a lead, and confirming the lead is saved with that representative as owner and creator.

**Acceptance Scenarios**:

1. **Given** a Sales Representative is signed in, **When** they submit a valid new lead, **Then** the lead is saved and assigned to the current user as owner and creator.
2. **Given** a Sales Representative creates a lead, **When** they view their lead list, **Then** the new lead appears in their own leads.
3. **Given** no alternate eligible owner exists, **When** a Sales Representative creates a lead, **Then** lead creation still succeeds because ownership is assigned to the creator.

---

### User Story 3 - Roles See the Correct Leads and Activity (Priority: P2)

Admins, Managers, and Sales Representatives view only the lead and activity information allowed by their responsibilities, with ownership and team scoping applied consistently.

**Why this priority**: Correct visibility protects customer data while enabling managers and admins to monitor operations.

**Independent Test**: Can be fully tested by creating leads for multiple representatives across teams, then verifying each role sees only the permitted records.

**Acceptance Scenarios**:

1. **Given** a Sales Representative has created leads, **When** they open lead management, **Then** they see only leads they own.
2. **Given** a Manager supervises a team, **When** they open lead and activity views, **Then** they see records owned by team members and do not see records from other teams.
3. **Given** an Admin opens lead and activity views, **When** records exist across representatives and teams, **Then** the Admin can see all permitted operational records.
4. **Given** a user requests a record outside their permitted scope, **When** the system evaluates access, **Then** access is denied without revealing restricted record details.

---

### User Story 4 - Admin Manages User Lifecycle Safely (Priority: P2)

An Admin can create, update, disable, and delete users while preserving historical accountability and preventing destructive account-management mistakes.

**Why this priority**: User management is incomplete without removal and disabling controls, but deletion must not break historical lead ownership or leave the CRM without an Admin.

**Independent Test**: Can be fully tested by disabling and deleting non-admin users, attempting blocked deletions, and confirming historical leads still show owner and creator information.

**Acceptance Scenarios**:

1. **Given** an Admin views the user list, **When** they choose Delete for a user, **Then** the CRM requires confirmation before deletion is completed.
2. **Given** an Admin attempts to delete their own account, **When** they confirm the action, **Then** the system blocks the deletion.
3. **Given** only one active Admin remains, **When** any user attempts to delete or disable that Admin, **Then** the system blocks the action.
4. **Given** a deleted Sales Representative owns leads, **When** Admins or Managers view historical lead records, **Then** the lead, owner, creator, notes, activities, and reporting history remain intact.

---

### User Story 5 - Admins and Managers Monitor Accountability Metrics (Priority: P3)

Admins and Managers review operational dashboard metrics that show lead ownership, sales representative activity, team activity, and lead sources.

**Why this priority**: Metrics are necessary for accountability and performance tracking once user access and lead creation are restored.

**Independent Test**: Can be fully tested by creating leads and activities across representatives and teams, then confirming dashboard totals and per-user metrics match the underlying records.

**Acceptance Scenarios**:

1. **Given** leads exist across representatives and teams, **When** an Admin opens the dashboard, **Then** they see total leads, leads per representative, leads per team, and leads by source.
2. **Given** team records exist, **When** a Manager opens the dashboard, **Then** they see metrics scoped to their team responsibilities.
3. **Given** a representative has leads, activities, and follow-ups, **When** their metric row is shown, **Then** it includes name, email, role, lead count, activity count, follow-up count, and last activity.

### Edge Cases

- A duplicate email is submitted during user creation.
- A password does not meet the required security policy.
- A newly created user attempts to sign in before any manual activation step exists.
- A disabled or deleted user attempts to sign in.
- An Admin attempts to delete or disable their own active account.
- A user action would leave the CRM with zero active Admin users.
- A deleted user owns or created historical leads, notes, activities, or follow-ups.
- A Manager has no assigned team members.
- A Sales Representative attempts to view or edit another representative's lead.
- A lead creation request is submitted with missing required lead details.
- Dashboard metrics are requested when no leads, activities, teams, or follow-ups exist.

## CRM & Security Considerations *(mandatory)*

- **Business Capability**: Restore the CRM operational foundation by making Admin-created users login-ready, ensuring representatives can create owned leads, enforcing role-scoped visibility, preserving user lifecycle accountability, and exposing basic operational performance metrics.
- **Affected CRM Data**: Users, roles, teams, leads, lead ownership, lead creation attribution, activities, follow-ups, dashboard metrics, credentials, and audit records.
- **Roles & Permissions**: Admins can manage users and view all leads, activities, follow-ups, and reports. Managers can view leads, activities, follow-ups, and metrics for their teams. Sales Representatives can create leads, view their own leads, and add notes or follow-ups to permitted leads. Sales Representatives cannot manage users or access admin pages. Denied requests must not reveal restricted customer, user, lead, or team details.
- **Audit & Activity Trail**: The CRM must record auditable events for user creation, credential assignment, sign-in success or denial, user updates, user disabling, user deletion, blocked self-deletion, blocked last-admin removal, lead creation, ownership assignment, visibility denials, notes, follow-ups, and dashboard-sensitive access where appropriate. Historical lead ownership and creator attribution must remain visible for authorized reporting even when a user is deleted.
- **Domain Events**: UserCreated, UserActivated, UserUpdated, UserDisabled, UserDeleted, UserDeletionBlocked, LeadCreated, LeadOwnershipAssigned, LeadVisibilityDenied, NoteAdded, FollowUpAdded, and DashboardMetricsViewed events should be available for downstream audit, reporting, and future notification workflows. Email invitation, activation-link delivery, AI scoring, forecasting, recommendations, WhatsApp automation, and executive analytics events are out of scope.
- **Security Controls**: Raw passwords must never be stored or displayed after submission. Credential inputs must be validated, protected from disclosure, and redacted from logs and audit records. Role and team access must be enforced before returning user, lead, activity, follow-up, or metric data. Deleted or disabled users must not be able to sign in. Sensitive notes must not expose credentials, private documents, payment data, or hidden audit metadata.

## Requirements *(mandatory)*

### Functional Requirements

#### Phase 1 - User Authentication Completion

- **FR-001**: The CRM MUST allow an Admin to create a user with email, display name, role, and an initial password.
- **FR-002**: The CRM MUST require a valid, unique email address, a non-empty display name, a supported CRM role, and a password that meets the configured security policy before creating a user.
- **FR-003**: The CRM MUST protect user credentials so raw passwords are never stored, returned, shown in lists, included in audit records, or exposed in operational logs.
- **FR-004**: The CRM MUST create Admin-created users as active by default so they can sign in immediately after receiving credentials.
- **FR-005**: The CRM MUST allow active users to sign in with their email and password and then access only the pages and data permitted by their role.
- **FR-006**: The CRM MUST deny sign-in for invalid credentials, disabled users, deleted users, and unsupported account states using safe messages that do not expose account or password details.

#### Phase 1.1 - User Activation and Lifecycle Management

- **FR-007**: The CRM MUST not require email verification, invitation links, activation emails, self-registration, or a separate activation page for Admin-created users in this phase.
- **FR-008**: The CRM MUST allow Admins to view, create, update, disable, and delete users from the user management area.
- **FR-009**: The CRM MUST require explicit confirmation before deleting a user and communicate that the action affects active access while preserving historical accountability records.
- **FR-010**: The CRM MUST prevent a signed-in Admin from deleting or disabling their own active account.
- **FR-011**: The CRM MUST prevent any action that would leave the CRM with zero active Admin users.
- **FR-012**: The CRM MUST preserve historical leads, lead owners, lead creators, notes, activities, follow-ups, and reports when a user is deleted.
- **FR-013**: The CRM MUST exclude deleted users from normal active-user selection and management lists unless an authorized user intentionally views historical or deleted-user context.

#### Phase 2 - Lead Ownership and Visibility

- **FR-014**: The CRM MUST allow Sales Representatives to create leads with required lead identity, contact, company, source, status, and priority details.
- **FR-015**: The CRM MUST automatically assign a lead's owner and creator to the signed-in Sales Representative when that representative creates the lead.
- **FR-016**: The CRM MUST stop lead creation from failing because the system cannot find another eligible lead owner when the signed-in Sales Representative is eligible to own the lead.
- **FR-017**: The CRM MUST show Sales Representatives only the leads they own unless another explicit permission grants broader access.
- **FR-018**: The CRM MUST show Managers only leads, activities, follow-ups, and metrics for team members within their responsibility.
- **FR-019**: The CRM MUST show Admins all leads, activities, follow-ups, ownership records, creator records, and reports across the CRM.
- **FR-020**: The CRM MUST clearly display Created By, Owned By, Created At, and Last Updated information for each lead to authorized users.
- **FR-021**: The CRM MUST allow permitted Sales Representatives to add notes and follow-ups to their own leads.
- **FR-022**: The CRM MUST include total leads, leads per representative, leads per team, leads by source, representative lead count, representative activity count, representative follow-up count, and representative last activity in authorized dashboard metrics.
- **FR-023**: The CRM MUST present empty states for dashboards, lead lists, team views, and representative metrics when no matching records exist.
- **FR-024**: The CRM MUST enforce role, ownership, and team scope consistently for list views, detail views, creation flows, note flows, follow-up flows, and dashboard metrics.

#### Scope Boundaries

- **FR-025**: The CRM MUST NOT introduce AI features, forecasting, recommendations, WhatsApp automation, or executive analytics as part of this feature.
- **FR-026**: The CRM MUST NOT introduce email invitation delivery, self-registration, password reset redesign, revenue attribution, commission calculations, or advanced reporting beyond the operational metrics listed in this specification.

### Key Entities *(include if feature involves data)*

- **User**: A CRM account with email, display name, role, status, lifecycle state, creation timestamp, update timestamp, and historical deletion context when applicable.
- **Credential**: Protected sign-in secret associated with a user account; never exposed after creation and never retained in raw form.
- **Role**: A responsibility category that determines CRM access for Admins, Managers, and Sales Representatives.
- **Team**: A grouping of users used to scope Manager visibility and team performance metrics.
- **Lead**: A customer or prospect record with identity, contact, company, source, status, priority, owner, creator, creation timestamp, and update timestamp.
- **Activity**: A recorded sales action associated with a lead and user for accountability and performance tracking.
- **Follow-up**: A planned or completed next action associated with a lead and user.
- **Dashboard Metric**: A summarized operational measure for leads, representatives, teams, sources, activities, follow-ups, and last activity.
- **Audit Record**: A protected record of security-sensitive or accountability-sensitive actions, including who acted, what changed, when it happened, and the business result.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Admin can create a login-ready user in under 2 minutes using required account details and credentials.
- **SC-002**: 100% of newly created active users can attempt sign-in immediately without waiting for invitation emails, activation links, or manual activation.
- **SC-003**: A newly created Sales Representative can sign in, reach the dashboard, and open lead management pages in under 3 minutes from account creation.
- **SC-004**: A Sales Representative can create a valid lead in under 2 minutes, and the saved lead always records that representative as owner and creator.
- **SC-005**: The "Eligible lead owner not found" failure does not occur for valid Sales Representative lead creation where the signed-in representative is eligible to own the lead.
- **SC-006**: 100% of saved leads display Created By, Owned By, Created At, and Last Updated to authorized users.
- **SC-007**: Sales Representatives are prevented from viewing leads they do not own in 100% of unauthorized access attempts tested.
- **SC-008**: Managers see team-scoped lead and activity information with no records from unrelated teams in 100% of authorization scenarios tested.
- **SC-009**: User deletion and disabling actions preserve historical lead ownership, creator attribution, notes, activities, follow-ups, and reporting records in 100% of tested lifecycle scenarios.
- **SC-010**: The CRM blocks self-deletion and last-active-admin removal in 100% of tested attempts.
- **SC-011**: Admin and Manager dashboards show lead and representative metrics within 30 seconds of opening the dashboard during normal workspace use.
- **SC-012**: At least 90% of test users completing the primary workflow can create a user, sign in as that user, create a lead, and verify ownership without support intervention.

## Assumptions

- Admins are responsible for securely sharing initial credentials with users outside the CRM for this phase.
- Password reset, email invitation, email verification, and self-registration workflows remain outside this feature unless already available elsewhere in the CRM.
- Existing CRM roles remain Admin, Manager, and Sales Representative.
- Existing team membership is the source of Manager visibility scope.
- A Sales Representative who creates a lead is considered eligible to own that lead by default.
- Deleted users are removed from active operation but remain available as historical references for authorized reporting and audit purposes.
- Dashboard metrics are operational summaries for current CRM management, not executive analytics or forecasting.
- Existing authentication, protected workspace, users, teams, leads, activities, follow-ups, and audit capabilities are available as foundations for planning.
