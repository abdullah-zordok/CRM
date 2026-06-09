# Tasks: User and Lead Recovery

**Input**: Design documents from `/specs/006-user-lead-recovery/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/user-lead-recovery-api.yaml, contracts/user-lead-recovery-ui.md, quickstart.md

**Tests**: Required. The plan requires contract, unit, integration, security-path, audit/event, and browser coverage before implementation is accepted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: User story label for traceability.
- Every task includes an exact repository file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add recovery contracts, verification hooks, and shared feature structure.

- [X] T001 Copy the User and Lead Recovery API contract from specs/006-user-lead-recovery/contracts/user-lead-recovery-api.yaml into packages/contracts/openapi.yaml
- [X] T002 [P] Add User and Lead Recovery contract loader helpers in packages/test-utils/src/user-lead-recovery-contract.ts
- [X] T003 [P] Add User and Lead Recovery fixture builders for users, teams, leads, activities, and follow-ups in packages/test-utils/src/user-lead-recovery-factories.ts
- [X] T004 Add focused recovery verification command implementation in packages/test-utils/src/verify-user-lead-recovery.ts
- [X] T005 Register the root verify:user-lead-recovery script in package.json
- [X] T006 [P] Create dashboard module registration shell in apps/api/src/modules/dashboards/dashboards.module.ts
- [X] T007 [P] Create dashboard API client shell in apps/web/features/workspace/api/operations-dashboard-client.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data, validation, permissions, audit, events, and access utilities required by every story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Update user lifecycle, credential, deleted-user, lead owner/creator, activity, follow-up, audit, and event fields in apps/api/prisma/schema.prisma
- [X] T009 Add the User and Lead Recovery migration with user deletion, active Admin, lead attribution, and dashboard query indexes in apps/api/prisma/migrations/20260602000001_user_lead_recovery/migration.sql
- [X] T010 [P] Add recovery event names for user lifecycle, login denial, lead ownership, visibility denial, note/follow-up additions, and dashboard access in apps/api/src/infrastructure/events/event-types.ts
- [X] T011 [P] Add recovery permission codes for login-ready user creation, user deletion, dashboard operations view, and scoped lead visibility in apps/api/src/modules/users/permissions/permission-codes.ts
- [X] T012 Update user creation, login, lifecycle, and lead creation validation schemas for recovery rules in apps/api/src/modules/users/users.schemas.ts
- [X] T013 Update lead ownership and scoped visibility validation schemas for recovery rules in apps/api/src/modules/leads/leads.schemas.ts
- [X] T014 [P] Add web user password and lifecycle validation schemas in apps/web/features/users/validation/users-validation.ts
- [X] T015 [P] Add web lead self-owned creation validation schemas in apps/web/features/leads/validation/leads-validation.ts
- [X] T016 Implement sanitized security audit helpers for credentials, deletion blocks, lead ownership, and dashboard access in apps/api/src/modules/users/audit/users-security-audit.service.ts
- [X] T017 Implement shared recovery event emitter helpers with sanitized payloads and correlation identifiers in apps/api/src/modules/users/admin-event.service.ts
- [X] T018 Implement deleted/disabled user denial checks in apps/api/src/common/guards/session.guard.ts
- [X] T019 Register DashboardsModule in the API application module in apps/api/src/app.module.ts
- [X] T020 [P] Add recovery contract path validation tests in apps/api/tests/contract/user-lead-recovery.contract.test.ts

**Checkpoint**: Shared schema, permissions, audit, events, guards, and module wiring are ready for story work.

---

## Phase 3: User Story 1 - Admin Creates Login-Ready Users (Priority: P1) MVP

**Goal**: Admins can create active users with permanent credentials, and those users can sign in immediately without activation.

**Independent Test**: Create a Sales Representative with email, display name, role, and password; sign in with those credentials; confirm permitted dashboard and lead pages open; confirm invalid, disabled, or deleted account login attempts are denied safely.

### Tests for User Story 1

- [X] T021 [P] [US1] Add contract tests for POST /users and POST /auth/login login-ready behavior in apps/api/tests/contract/user-login-ready.contract.test.ts
- [X] T022 [P] [US1] Add unit tests for password validation, credential redaction, active default status, and activation bypass in apps/api/tests/unit/user-login-ready-rules.test.ts
- [X] T023 [P] [US1] Add integration tests for Admin-created immediate login and disabled/deleted login denial in apps/api/tests/integration/user-login-ready.integration.test.ts
- [X] T024 [P] [US1] Add security-path integration tests for duplicate email, raw password redaction, invalid credentials, and denied account states in apps/api/tests/integration/user-login-ready-security.integration.test.ts
- [X] T025 [P] [US1] Add browser tests for user creation password field, immediate login, and safe login denial states in apps/web/tests/e2e/user-login-ready.e2e.ts

### Implementation for User Story 1

- [X] T026 [US1] Update CreateUser DTOs and response DTOs to accept password and never return credential fields in apps/api/src/modules/users/users.dto.ts
- [X] T027 [US1] Update UsersRepository to persist credential hashes, active default status, and normalized unique email checks in apps/api/src/modules/users/users.repository.ts
- [X] T028 [US1] Update UsersService create flow to hash initial passwords, set ACTIVE status, skip required activation, audit creation, and emit UserCreated/UserActivated events in apps/api/src/modules/users/users.service.ts
- [X] T029 [US1] Update AuthService login flow to validate password hashes and deny disabled/deleted/unsupported users with safe messages in apps/api/src/modules/auth/auth.service.ts
- [X] T030 [US1] Update AuthRepository credential lookup to include active/deleted lifecycle fields without exposing password hashes in apps/api/src/modules/auth/auth.repository.ts
- [X] T031 [US1] Update UsersController create endpoint wiring for login-ready user creation in apps/api/src/modules/users/users.controller.ts
- [X] T032 [US1] Update web users API client to submit initial password and consume redacted responses in apps/web/features/users/api/users-client.ts
- [X] T033 [P] [US1] Update user creation form with password input, validation feedback, and no activation copy in apps/web/features/users/components/user-form.tsx
- [X] T034 [P] [US1] Update login form denial states for invalid, disabled, and deleted users in apps/web/features/foundation/auth/login-form.tsx
- [X] T035 [US1] Update protected user management page integration for login-ready creation in apps/web/app/(protected)/users/page.tsx
- [X] T036 [US1] Extend focused recovery verification for Admin create, immediate login, credential redaction, and login denial in packages/test-utils/src/verify-user-lead-recovery.ts

**Checkpoint**: User Story 1 is independently functional as the MVP.

---

## Phase 4: User Story 2 - Sales Representative Creates Owned Leads (Priority: P1)

**Goal**: Sales Representatives can create valid leads without selecting another owner, and saved leads record the current user as owner and creator.

**Independent Test**: Sign in as a Sales Representative, create a valid lead without choosing an owner, confirm lead creation succeeds, and verify Owned By and Created By are the current user.

### Tests for User Story 2

- [X] T037 [P] [US2] Add contract tests for POST /leads self-owned representative creation in apps/api/tests/contract/leads-self-owned-create.contract.test.ts
- [X] T038 [P] [US2] Add unit tests for current-user owner assignment and alternate-owner lookup bypass in apps/api/tests/unit/leads-self-owned-create-rules.test.ts
- [X] T039 [P] [US2] Add integration tests for Sales Representative lead creation without another eligible owner in apps/api/tests/integration/leads-self-owned-create.integration.test.ts
- [X] T040 [P] [US2] Add security-path tests for representative owner override denial and inactive creator denial in apps/api/tests/integration/leads-self-owned-create-security.integration.test.ts
- [X] T041 [P] [US2] Add browser tests for Sales Representative lead create form, no owner selector, and owner/creator display in apps/web/tests/e2e/leads-self-owned-create.e2e.ts

### Implementation for User Story 2

- [X] T042 [US2] Update LeadRepository create writes to persist ownerId and createdById from the current user for representative-created leads in apps/api/src/modules/leads/leads.repository.ts
- [X] T043 [US2] Update LeadAssignmentService to bypass alternate eligible-owner search for representative self-owned creation in apps/api/src/modules/leads/assignment/lead-assignment.service.ts
- [X] T044 [US2] Update LeadService createLead to set ownerId/currentUser.id and createdById/currentUser.id for Sales Representatives, audit ownership, and emit LeadOwnershipAssigned in apps/api/src/modules/leads/leads.service.ts
- [X] T045 [US2] Update LeadsController POST /leads handling to ignore unauthorized representative owner overrides in apps/api/src/modules/leads/leads.controller.ts
- [X] T046 [US2] Update lead response DTOs to include Created By and Owned By display fields for authorized users in apps/api/src/modules/leads/leads.dto.ts
- [X] T047 [US2] Update web leads API client and types for owner/creator fields in apps/web/features/leads/api/leads-client.ts
- [X] T048 [P] [US2] Update lead form to hide owner selection for Sales Representatives and show safe creation errors in apps/web/features/leads/components/lead-form.tsx
- [X] T049 [P] [US2] Update lead detail summary to display Created By, Owned By, Created At, and Last Updated in apps/web/app/(protected)/leads/[leadId]/page.tsx
- [X] T050 [US2] Extend focused recovery verification for representative self-owned lead creation and ownership attribution in packages/test-utils/src/verify-user-lead-recovery.ts

**Checkpoint**: User Story 2 is independently functional and removes the "Eligible lead owner not found" failure for valid representative creation.

---

## Phase 5: User Story 3 - Roles See the Correct Leads and Activity (Priority: P2)

**Goal**: Admins, Managers, and Sales Representatives see only the lead, activity, and follow-up records allowed by their role, ownership, and team scope.

**Independent Test**: Create leads for multiple representatives across teams, then verify Sales Representatives see owned leads only, Managers see team records only, Admins see all records, and denied requests do not reveal restricted details.

### Tests for User Story 3

- [X] T051 [P] [US3] Add contract tests for scoped GET /leads and GET /leads/{leadId} visibility in apps/api/tests/contract/leads-visibility-recovery.contract.test.ts
- [X] T052 [P] [US3] Add unit tests for Admin global, Manager team, Sales Representative owned, and default-deny access rules in apps/api/tests/unit/leads-visibility-recovery-rules.test.ts
- [X] T053 [P] [US3] Add integration tests for scoped lead, activity, and follow-up visibility across roles and teams in apps/api/tests/integration/leads-visibility-recovery.integration.test.ts
- [X] T054 [P] [US3] Add security-path integration tests for out-of-scope lead detail, hidden duplicate context, and privacy-safe denial responses in apps/api/tests/integration/leads-visibility-recovery-security.integration.test.ts
- [X] T055 [P] [US3] Add browser tests for role-scoped lead lists, denied detail state, and team empty states in apps/web/tests/e2e/leads-visibility-recovery.e2e.ts

### Implementation for User Story 3

- [X] T056 [US3] Update LeadAccessService for recovery scope rules across leads, notes, activities, follow-ups, and metric reads in apps/api/src/modules/leads/permissions/lead-access.service.ts
- [X] T057 [US3] Update LeadsRepository scoped list/detail queries to apply owner, team, and Admin global filters before returning data in apps/api/src/modules/leads/leads.repository.ts
- [X] T058 [US3] Update activities access checks to mirror lead ownership and team scope for activity reads in apps/api/src/modules/leads/activities/lead-activity.service.ts
- [X] T059 [US3] Update follow-up access checks to mirror lead ownership and team scope for follow-up reads in apps/api/src/modules/leads/activities/follow-up.service.ts
- [X] T060 [US3] Update LeadsService list/detail methods to record visibility denials and return privacy-safe not-found/forbidden responses in apps/api/src/modules/leads/leads.service.ts
- [X] T061 [US3] Update web lead hooks to pass scoped filters and handle denied/empty states in apps/web/features/leads/hooks/use-leads.ts
- [X] T062 [P] [US3] Update lead list component for role-scoped empty, denied, and filtered states in apps/web/features/leads/components/lead-list.tsx
- [X] T063 [P] [US3] Update team user view to show Manager scoped lead/activity summaries without global leakage in apps/web/features/users/components/team-user-view.tsx
- [X] T064 [US3] Extend focused recovery verification for role-scoped lead/activity/follow-up visibility and denial audit events in packages/test-utils/src/verify-user-lead-recovery.ts

**Checkpoint**: User Story 3 is independently functional and protects scoped CRM data.

---

## Phase 6: User Story 4 - Admin Manages User Lifecycle Safely (Priority: P2)

**Goal**: Admins can disable and delete users safely while preserving history and blocking self-deletion and last-active-admin removal.

**Independent Test**: Disable and delete a non-admin user, verify active access is removed, verify historical leads retain owner/creator context, and confirm self-delete and last-active-admin removal are blocked.

### Tests for User Story 4

- [X] T065 [P] [US4] Add contract tests for PATCH /users/{userId} status changes and DELETE /users/{userId} lifecycle behavior in apps/api/tests/contract/users-lifecycle-recovery.contract.test.ts
- [X] T066 [P] [US4] Add unit tests for soft deletion, session revocation, self-action blocking, last-active-admin counting, and historical reference preservation in apps/api/tests/unit/users-lifecycle-recovery-rules.test.ts
- [X] T067 [P] [US4] Add integration tests for disable, delete, deleted login denial, preserved lead ownership, and deleted-user active-list exclusion in apps/api/tests/integration/users-lifecycle-recovery.integration.test.ts
- [X] T068 [P] [US4] Add security-path integration tests for self-delete denial, self-disable denial, last-active-admin denial, and sanitized lifecycle audit metadata in apps/api/tests/integration/users-lifecycle-recovery-security.integration.test.ts
- [X] T069 [P] [US4] Add browser tests for delete confirmation, disabled/deleted states, blocked lifecycle actions, and preserved lead owner labels in apps/web/tests/e2e/users-lifecycle-recovery.e2e.ts

### Implementation for User Story 4

- [X] T070 [US4] Update UsersRepository with soft delete, active list exclusion, deleted user lookup, active Admin counting, and session revocation queries in apps/api/src/modules/users/users.repository.ts
- [X] T071 [US4] Update UsersService lifecycle methods to block self-actions, block last-active-admin removal, soft delete users, revoke sessions, audit actions, and emit UserDeleted/UserDeletionBlocked events in apps/api/src/modules/users/users.service.ts
- [X] T072 [US4] Add DELETE /users/{userId} endpoint and lifecycle conflict responses in apps/api/src/modules/users/users.controller.ts
- [X] T073 [US4] Update user security audit service for delete, disable, blocked self-action, blocked last-admin action, and session revocation metadata in apps/api/src/modules/users/audit/users-security-audit.service.ts
- [X] T074 [US4] Update lead owner/creator display helpers to preserve deleted-user historical labels in apps/api/src/modules/leads/leads.service.ts
- [X] T075 [US4] Update web users API client with delete and lifecycle conflict handling in apps/web/features/users/api/users-client.ts
- [X] T076 [P] [US4] Update user list component with Delete action, confirmation dialog, deleted/disabled states, and blocked-action feedback in apps/web/features/users/components/user-list.tsx
- [X] T077 [P] [US4] Update user detail component with lifecycle actions and historical-account warnings in apps/web/features/users/components/user-detail.tsx
- [X] T078 [US4] Extend focused recovery verification for delete, disable, blocked safety rules, session denial, and preserved lead references in packages/test-utils/src/verify-user-lead-recovery.ts

**Checkpoint**: User Story 4 is independently functional and preserves historical accountability.

---

## Phase 7: User Story 5 - Admins and Managers Monitor Accountability Metrics (Priority: P3)

**Goal**: Admins and Managers can view scoped operational metrics for leads, representatives, teams, sources, activities, follow-ups, and last activity.

**Independent Test**: Create leads, activities, and follow-ups across representatives and teams; confirm Admin metrics are global, Manager metrics are team-scoped, and empty states show zero/empty groups.

### Tests for User Story 5

- [X] T079 [P] [US5] Add contract tests for GET /dashboard/operations scoped metric responses in apps/api/tests/contract/operations-dashboard-recovery.contract.test.ts
- [X] T080 [P] [US5] Add unit tests for operational metric aggregation, empty states, deleted-user references, and scope filtering in apps/api/tests/unit/operations-dashboard-recovery-rules.test.ts
- [X] T081 [P] [US5] Add integration tests for Admin global metrics, Manager team metrics, Sales Representative denial, and dashboard audit events in apps/api/tests/integration/operations-dashboard-recovery.integration.test.ts
- [X] T082 [P] [US5] Add browser tests for dashboard totals, representative rows, team/source breakdowns, Manager scope, and empty states in apps/web/tests/e2e/operations-dashboard-recovery.e2e.ts

### Implementation for User Story 5

- [X] T083 [US5] Implement dashboard metric repository queries for leads by representative, team, source, activity count, follow-up count, and last activity in apps/api/src/modules/dashboards/operations-dashboard.repository.ts
- [X] T084 [US5] Implement dashboard metric service with Admin global scope, Manager team scope, Sales Representative denial, audit, and DashboardMetricsViewed events in apps/api/src/modules/dashboards/operations-dashboard.service.ts
- [X] T085 [US5] Implement GET /dashboard/operations controller endpoint with safe empty responses in apps/api/src/modules/dashboards/operations-dashboard.controller.ts
- [X] T086 [US5] Update DashboardsModule provider/controller registration in apps/api/src/modules/dashboards/dashboards.module.ts
- [X] T087 [US5] Implement web operations dashboard API client and response types in apps/web/features/workspace/api/operations-dashboard-client.ts
- [X] T088 [P] [US5] Implement dashboard metric panels for totals, representative rows, team breakdown, source breakdown, and empty states in apps/web/features/workspace/components/operations-dashboard.tsx
- [X] T089 [US5] Integrate scoped operational metrics into the protected dashboard page in apps/web/app/(protected)/dashboard/page.tsx
- [X] T090 [US5] Extend focused recovery verification for Admin and Manager dashboard metrics and Sales Representative denial in packages/test-utils/src/verify-user-lead-recovery.ts

**Checkpoint**: User Story 5 is independently functional and completes the operational accountability workflow.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, full verification, and regression checks across all stories.

- [X] T091 [P] Update API recovery documentation for credentials, deletion, ownership, metrics, audit, and events in docs/security/user-lead-recovery.md
- [X] T092 [P] Update recovery troubleshooting documentation for login denial, lead owner assignment, lifecycle blocks, and dashboard scope in docs/troubleshooting/user-lead-recovery.md
- [X] T093 [P] Update the API README with recovery migration, verification, and environment notes in apps/api/README.md
- [X] T094 [P] Update the web README with recovery user, lead, dashboard, and browser validation notes in apps/web/README.md
- [X] T095 Run unit tests with pnpm test:unit and fix recovery failures in apps/api/tests/unit/user-login-ready-rules.test.ts
- [X] T096 Run contract tests with pnpm test:contract and fix recovery failures in apps/api/tests/contract/user-lead-recovery.contract.test.ts
- [X] T097 Run integration tests with pnpm test:integration and fix recovery failures in apps/api/tests/integration/user-login-ready.integration.test.ts
- [ ] T098 Run browser tests with pnpm test:e2e and fix recovery failures in apps/web/tests/e2e/user-login-ready.e2e.ts
- [X] T099 Run focused verification with pnpm verify:user-lead-recovery and fix failures in packages/test-utils/src/verify-user-lead-recovery.ts
- [ ] T100 Run build and CI-equivalent verification with pnpm build and pnpm ci:verify and fix recovery regressions in package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase; delivers MVP login-ready user creation.
- **User Story 2 (P1)**: Can start after Foundational phase with a fixture Sales Representative, but is easiest to validate after US1.
- **User Story 3 (P2)**: Can start after Foundational phase with seeded users/leads, but validates best after US2 creates owned leads.
- **User Story 4 (P2)**: Can start after Foundational phase with seeded users/leads, but validates best after US1 and US2.
- **User Story 5 (P3)**: Can start after Foundational phase with seeded records, but depends on US2/US3/US4 behavior for full manual acceptance.

### Within Each User Story

- Write and run failing tests before implementation tasks.
- Update data/repository logic before services.
- Update services before controllers.
- Update API clients before web components.
- Complete story-specific verification before moving to the next priority.

### Parallel Opportunities

- Setup tasks T002, T003, T006, and T007 can run in parallel after T001.
- Foundational tasks T010, T011, T014, T015, and T020 can run in parallel after T008-T009.
- User story test tasks marked [P] can run in parallel within each story.
- Web component tasks marked [P] can run in parallel with backend implementation once API contracts are stable.
- US2, US3, US4, and US5 can be staffed in parallel after Foundational completion if teams coordinate shared files.

---

## Parallel Example: User Story 1

```bash
Task: "T021 [P] [US1] Add contract tests for POST /users and POST /auth/login login-ready behavior in apps/api/tests/contract/user-login-ready.contract.test.ts"
Task: "T022 [P] [US1] Add unit tests for password validation, credential redaction, active default status, and activation bypass in apps/api/tests/unit/user-login-ready-rules.test.ts"
Task: "T023 [P] [US1] Add integration tests for Admin-created immediate login and disabled/deleted login denial in apps/api/tests/integration/user-login-ready.integration.test.ts"
Task: "T024 [P] [US1] Add security-path integration tests for duplicate email, raw password redaction, invalid credentials, and denied account states in apps/api/tests/integration/user-login-ready-security.integration.test.ts"
Task: "T025 [P] [US1] Add browser tests for user creation password field, immediate login, and safe login denial states in apps/web/tests/e2e/user-login-ready.e2e.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T037 [P] [US2] Add contract tests for POST /leads self-owned representative creation in apps/api/tests/contract/leads-self-owned-create.contract.test.ts"
Task: "T038 [P] [US2] Add unit tests for current-user owner assignment and alternate-owner lookup bypass in apps/api/tests/unit/leads-self-owned-create-rules.test.ts"
Task: "T039 [P] [US2] Add integration tests for Sales Representative lead creation without another eligible owner in apps/api/tests/integration/leads-self-owned-create.integration.test.ts"
Task: "T040 [P] [US2] Add security-path tests for representative owner override denial and inactive creator denial in apps/api/tests/integration/leads-self-owned-create-security.integration.test.ts"
Task: "T041 [P] [US2] Add browser tests for Sales Representative lead create form, no owner selector, and owner/creator display in apps/web/tests/e2e/leads-self-owned-create.e2e.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T051 [P] [US3] Add contract tests for scoped GET /leads and GET /leads/{leadId} visibility in apps/api/tests/contract/leads-visibility-recovery.contract.test.ts"
Task: "T052 [P] [US3] Add unit tests for Admin global, Manager team, Sales Representative owned, and default-deny access rules in apps/api/tests/unit/leads-visibility-recovery-rules.test.ts"
Task: "T053 [P] [US3] Add integration tests for scoped lead, activity, and follow-up visibility across roles and teams in apps/api/tests/integration/leads-visibility-recovery.integration.test.ts"
Task: "T054 [P] [US3] Add security-path integration tests for out-of-scope lead detail, hidden duplicate context, and privacy-safe denial responses in apps/api/tests/integration/leads-visibility-recovery-security.integration.test.ts"
Task: "T055 [P] [US3] Add browser tests for role-scoped lead lists, denied detail state, and team empty states in apps/web/tests/e2e/leads-visibility-recovery.e2e.ts"
```

## Parallel Example: User Story 4

```bash
Task: "T065 [P] [US4] Add contract tests for PATCH /users/{userId} status changes and DELETE /users/{userId} lifecycle behavior in apps/api/tests/contract/users-lifecycle-recovery.contract.test.ts"
Task: "T066 [P] [US4] Add unit tests for soft deletion, session revocation, self-action blocking, last-active-admin counting, and historical reference preservation in apps/api/tests/unit/users-lifecycle-recovery-rules.test.ts"
Task: "T067 [P] [US4] Add integration tests for disable, delete, deleted login denial, preserved lead ownership, and deleted-user active-list exclusion in apps/api/tests/integration/users-lifecycle-recovery.integration.test.ts"
Task: "T068 [P] [US4] Add security-path integration tests for self-delete denial, self-disable denial, last-active-admin denial, and sanitized lifecycle audit metadata in apps/api/tests/integration/users-lifecycle-recovery-security.integration.test.ts"
Task: "T069 [P] [US4] Add browser tests for delete confirmation, disabled/deleted states, blocked lifecycle actions, and preserved lead owner labels in apps/web/tests/e2e/users-lifecycle-recovery.e2e.ts"
```

## Parallel Example: User Story 5

```bash
Task: "T079 [P] [US5] Add contract tests for GET /dashboard/operations scoped metric responses in apps/api/tests/contract/operations-dashboard-recovery.contract.test.ts"
Task: "T080 [P] [US5] Add unit tests for operational metric aggregation, empty states, deleted-user references, and scope filtering in apps/api/tests/unit/operations-dashboard-recovery-rules.test.ts"
Task: "T081 [P] [US5] Add integration tests for Admin global metrics, Manager team metrics, Sales Representative denial, and dashboard audit events in apps/api/tests/integration/operations-dashboard-recovery.integration.test.ts"
Task: "T082 [P] [US5] Add browser tests for dashboard totals, representative rows, team/source breakdowns, Manager scope, and empty states in apps/web/tests/e2e/operations-dashboard-recovery.e2e.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate Admin-created immediate login, credential redaction, activation bypass, and denied login states.
5. Demo login-ready user creation before lead ownership and lifecycle management work continues.

### Incremental Delivery

1. Setup + Foundational: contracts, migrations, permissions, audit/events, guards, and verification ready.
2. US1: Admin-created users can sign in immediately.
3. US2: Sales Representatives can create self-owned leads.
4. US3: Role, ownership, and team-scoped visibility protects leads and activity.
5. US4: Admin user lifecycle controls are safe and historical references remain intact.
6. US5: Admin and Manager operational metrics are available and scoped.
7. Final Polish: documentation, security review, quickstart validation, full verification, and CI.

### Parallel Team Strategy

1. Team completes Setup and Foundational tasks together.
2. After Foundational completion, one developer owns US1 login-ready users, one owns US2 lead creation, one owns US3 visibility, one owns US4 lifecycle, and one owns US5 metrics.
3. Coordinate shared edits to apps/api/src/modules/users/users.service.ts, apps/api/src/modules/leads/leads.service.ts, apps/api/src/modules/leads/leads.repository.ts, apps/web/app/(protected)/leads/[leadId]/page.tsx, and packages/test-utils/src/verify-user-lead-recovery.ts.

---

## Notes

- [P] tasks touch different files and can run in parallel once their prerequisites are met.
- [US1] through [US5] map to the user stories in specs/006-user-lead-recovery/spec.md.
- Tests must be written first and fail before implementation work begins.
- Each story checkpoint should be validated independently before moving forward.
- Keep email invitations, activation links, self-registration, password reset redesign, AI, forecasting, recommendations, WhatsApp automation, executive analytics, revenue attribution, commission calculations, and advanced reporting out of this feature.
