# Tasks: Leads Core

**Input**: Design documents from `/specs/003-leads-core/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required. The plan requires contract, unit, integration, security-path, migration, performance-seeded, event, and browser coverage before implementation is accepted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: User story label for traceability.
- Every task includes an exact repository file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add Phase 2 contract, verification hooks, and feature structure.

- [X] T001 Copy the Leads Core OpenAPI contract from specs/003-leads-core/contracts/openapi.yaml into packages/contracts/openapi.yaml
- [X] T002 [P] Add Leads Core contract loader in packages/test-utils/src/leads-core-contract.ts
- [X] T003 [P] Add Leads Core fixture builders in packages/test-utils/src/leads-core-factories.ts
- [X] T004 Add Leads Core verification command implementation in packages/test-utils/src/verify-leads-core.ts
- [X] T005 Register the root verify:leads-core script in package.json
- [X] T006 Create backend Leads module directory skeleton with module registration stub in apps/api/src/modules/leads/leads.module.ts
- [X] T007 Create frontend Leads feature directory skeleton with typed client stub in apps/web/features/leads/api/leads-client.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data, permission, validation, audit, and event foundation required by every story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Define Lead, LeadSource, LeadExhibitionReference, LeadAssignment, LeadStatusHistory, LeadNote, LeadHistoryEntry, LeadAccessDecision, and LeadDomainEvent models in apps/api/prisma/schema.prisma
- [X] T009 Add the Leads Core database migration with indexes and active duplicate uniqueness rules in apps/api/prisma/migrations/20260601000000_leads_core/migration.sql
- [X] T010 Seed active lead sources EXHIBITION, REFERRAL, WEBSITE, INBOUND_INQUIRY, MANUAL_ENTRY, and OTHER in apps/api/prisma/seed.ts
- [X] T011 [P] Add LeadStatus, LeadPriority, lead action, lead event, and lead history enums in apps/api/src/modules/leads/leads.types.ts
- [X] T012 [P] Add Lead permission codes for create, view, update, assign, change status, add note, view history, and search in apps/api/src/modules/users/permissions/permission-codes.ts
- [X] T013 Implement lead request/response schemas and stale version validation in apps/api/src/modules/leads/leads.schemas.ts
- [X] T014 [P] Implement lead-safe error codes and response DTOs in apps/api/src/modules/leads/leads.dto.ts
- [X] T015 Implement LeadAccessService for Admin global scope, Manager team scope, Sales Representative owned/explicit scope, and default-deny decisions in apps/api/src/modules/leads/permissions/lead-access.service.ts
- [X] T016 Implement LeadAuditService for sanitized audit records and access decisions in apps/api/src/modules/leads/audit/lead-audit.service.ts
- [X] T017 Implement LeadEventService and event payload sanitization for LeadCreated, LeadAssigned, LeadStatusChanged, LeadSourceChanged, and LeadNoteAdded in apps/api/src/modules/leads/events/lead-event.service.ts
- [X] T018 Register LeadsModule providers, controllers, and imported auth/users/audit/event dependencies in apps/api/src/modules/leads/leads.module.ts
- [X] T019 Register LeadsModule in the API application module in apps/api/src/app.module.ts
- [X] T020 [P] Add shared web lead validation schemas in apps/web/features/leads/validation/leads-validation.ts
- [X] T021 [P] Add shared web lead query keys and hooks shell in apps/web/features/leads/hooks/use-leads.ts
- [X] T022 [P] Add Leads Core contract-path verification tests in apps/api/tests/contract/leads-core.contract.test.ts

**Checkpoint**: Lead data model, permissions, validation, audit, events, and module registration are ready for story work.

---

## Phase 3: User Story 1 - Create And Capture Leads (Priority: P1) MVP

**Goal**: Authorized users can create leads with required contact/source/priority/owner data, optional budget/exhibition/note data, duplicate blocking, safe errors, and scoped list/detail access.

**Independent Test**: Sign in as an authorized user, create a valid lead, confirm it is saved with owner/source/status/priority/audit trail, verify invalid and duplicate submissions fail safely, and verify unauthorized users cannot create or view leads outside scope.

### Tests for User Story 1

- [X] T023 [P] [US1] Add contract tests for POST /leads, GET /leads, GET /leads/{leadId}, and GET /leads/sources in apps/api/tests/contract/leads-create.contract.test.ts
- [X] T024 [P] [US1] Add unit tests for lead creation validation, contact normalization, source validation, and initial status rules in apps/api/tests/unit/leads-create-validation.test.ts
- [X] T025 [P] [US1] Add unit tests for platform-wide active duplicate blocking and privacy-safe restricted-match messages in apps/api/tests/unit/leads-duplicate-detection.test.ts
- [X] T026 [P] [US1] Add integration tests for Admin, Manager, and Sales Representative lead creation and scoped lead listing in apps/api/tests/integration/leads-create.integration.test.ts
- [X] T027 [P] [US1] Add security-path integration tests for anonymous create, out-of-scope view, and restricted duplicate behavior in apps/api/tests/integration/leads-create-rbac.integration.test.ts
- [X] T028 [P] [US1] Add browser tests for protected lead list, create form, validation errors, duplicate errors, and permission-denied state in apps/web/tests/e2e/leads-create.e2e.ts

### Implementation for User Story 1

- [X] T029 [P] [US1] Implement LeadRepository create, find by id, scoped search, source lookup, duplicate lookup, and version reads in apps/api/src/modules/leads/leads.repository.ts
- [X] T030 [P] [US1] Implement LeadSourceService for selectable active lead sources in apps/api/src/modules/leads/sources/lead-source.service.ts
- [X] T031 [US1] Implement LeadDuplicateService for platform-wide active email/phone duplicate blocking in apps/api/src/modules/leads/leads-duplicate.service.ts
- [X] T032 [US1] Implement LeadService createLead, getLeadDetail, and searchLeads with access checks, validation, duplicate blocking, audit, and LeadCreated event emission in apps/api/src/modules/leads/leads.service.ts
- [X] T033 [US1] Implement LeadsController endpoints for POST /leads, GET /leads, GET /leads/{leadId}, and GET /leads/sources in apps/api/src/modules/leads/leads.controller.ts
- [X] T034 [US1] Implement web leads API client methods for create, list, detail, and sources in apps/web/features/leads/api/leads-client.ts
- [X] T035 [P] [US1] Implement lead list component with search, filters, pagination, loading, empty, error, and permission-denied states in apps/web/features/leads/components/lead-list.tsx
- [X] T036 [P] [US1] Implement lead create form with contact/source/priority/owner/budget/exhibition/initial-note validation in apps/web/features/leads/components/lead-form.tsx
- [X] T037 [US1] Implement protected lead list and create page integration in apps/web/app/(protected)/leads/page.tsx
- [X] T038 [US1] Implement lead detail read view with owner, source, status, priority, budget, exhibition reference, version, and correlation display in apps/web/app/(protected)/leads/[leadId]/page.tsx
- [X] T039 [US1] Add Leads Core contract fragments to packages/test-utils/src/verify-leads-core.ts

**Checkpoint**: User Story 1 is independently functional as the MVP.

---

## Phase 4: User Story 2 - Assign And Work Leads (Priority: P1)

**Goal**: Admins and Managers can assign and reassign leads within permitted scope, Sales Representatives cannot assign leads to others, ineligible assignees are blocked, and assignment history drives future visibility.

**Independent Test**: Create leads, assign them to eligible Sales Representatives, reassign within Manager scope, verify Admin cross-team reassignment, and confirm denied or ineligible assignment attempts are audited.

### Tests for User Story 2

- [X] T040 [P] [US2] Add contract tests for PUT /leads/{leadId}/assignment in apps/api/tests/contract/leads-assignment.contract.test.ts
- [X] T041 [P] [US2] Add unit tests for assignment eligibility, Manager team-scope rules, Sales Representative denial, and team scope updates in apps/api/tests/unit/leads-assignment-rules.test.ts
- [X] T042 [P] [US2] Add integration tests for Admin cross-team assignment, Manager in-team assignment, Sales Representative denial, disabled assignee rejection, and assignment history in apps/api/tests/integration/leads-assignment.integration.test.ts
- [X] T043 [P] [US2] Add browser tests for assignment controls, eligible assignee selection, denied assignment state, and updated owner visibility in apps/web/tests/e2e/leads-assignment.e2e.ts

### Implementation for User Story 2

- [X] T044 [P] [US2] Implement LeadAssignmentRepository for assignment history writes and owner/team updates in apps/api/src/modules/leads/assignment/lead-assignment.repository.ts
- [X] T045 [US2] Implement LeadAssignmentService with eligibility checks, team-scope checks, stale version checks, audit, history, and LeadAssigned event emission in apps/api/src/modules/leads/assignment/lead-assignment.service.ts
- [X] T046 [US2] Add PUT /leads/{leadId}/assignment endpoint wiring in apps/api/src/modules/leads/leads.controller.ts
- [X] T047 [US2] Add lead assignment API client method in apps/web/features/leads/api/leads-client.ts
- [X] T048 [P] [US2] Implement lead assignment panel with eligible users, reason field, stale conflict display, and denied state in apps/web/features/leads/components/lead-assignment-panel.tsx
- [X] T049 [US2] Integrate assignment panel and assignment history into lead detail page in apps/web/app/(protected)/leads/[leadId]/page.tsx
- [X] T050 [US2] Extend Leads Core verification for assignment and visibility checks in packages/test-utils/src/verify-leads-core.ts

**Checkpoint**: User Stories 1 and 2 both work independently and preserve scoped visibility.

---

## Phase 5: User Story 3 - Track Lead Status And Pipeline (Priority: P2)

**Goal**: Authorized users can move leads through the approved status flow, Admins/Managers can correct, archive, and restore statuses, invalid transitions are rejected, and lead search/filter supports 10,000 active leads.

**Independent Test**: Update status through the normal flow, reject invalid Sales Representative backward movement, allow Admin/Manager correction/archive/restore, filter leads by pipeline fields, and validate list/search behavior at 10,000 active leads.

### Tests for User Story 3

- [X] T051 [P] [US3] Add contract tests for PUT /leads/{leadId}/status and filtered GET /leads responses in apps/api/tests/contract/leads-status.contract.test.ts
- [X] T052 [P] [US3] Add unit tests for status transition matrix, Admin/Manager corrections, archive/restore rules, and stale version status updates in apps/api/tests/unit/leads-status-rules.test.ts
- [X] T053 [P] [US3] Add integration tests for status flow, invalid transitions, correction history, archive/restore, and status event/audit records in apps/api/tests/integration/leads-status.integration.test.ts
- [X] T054 [P] [US3] Add performance-seeded integration test for 10,000 active lead search/filter/list validation in apps/api/tests/integration/leads-search-scale.integration.test.ts
- [X] T055 [P] [US3] Add browser tests for status controls, pipeline filters, archive/restore, invalid transition feedback, and list pagination in apps/web/tests/e2e/leads-status-pipeline.e2e.ts

### Implementation for User Story 3

- [X] T056 [P] [US3] Implement LeadStatusRepository for status history writes and archive/restore fields in apps/api/src/modules/leads/status/lead-status.repository.ts
- [X] T057 [US3] Implement LeadStatusService with forward flow, correction, archive, restore, stale version checks, audit, history, and LeadStatusChanged event emission in apps/api/src/modules/leads/status/lead-status.service.ts
- [X] T058 [US3] Add PUT /leads/{leadId}/status endpoint wiring and filtered search query support in apps/api/src/modules/leads/leads.controller.ts
- [X] T059 [US3] Optimize LeadRepository scoped search, filtering, sorting, and pagination for the 10,000 active-lead validation target in apps/api/src/modules/leads/leads.repository.ts
- [X] T060 [US3] Add lead status API client method and filter query support in apps/web/features/leads/api/leads-client.ts
- [X] T061 [P] [US3] Implement lead status control with role-aware actions, correction reason, archive/restore, and conflict state in apps/web/features/leads/components/lead-status-control.tsx
- [X] T062 [P] [US3] Implement lead pipeline filter bar for status, source, priority, assignee, team, exhibition, and date filters in apps/web/features/leads/components/lead-filter-bar.tsx
- [X] T063 [US3] Integrate status controls and pipeline filters into lead list/detail pages in apps/web/app/(protected)/leads/page.tsx
- [X] T064 [US3] Extend Leads Core verification for status flow and 10,000 active-lead search checks in packages/test-utils/src/verify-leads-core.ts

**Checkpoint**: User Stories 1, 2, and 3 are independently functional and search remains within the Phase 2 scale target.

---

## Phase 6: User Story 4 - Add Lead Notes And Source Context (Priority: P2)

**Goal**: Authorized users can add append-only notes, view note/history context, manage lightweight exhibition references, and keep later activity timeline scope excluded.

**Independent Test**: Add notes to accessible leads, verify users without access are denied, confirm notes cannot be edited/deleted through normal workflows, view source/exhibition context on lead detail, and verify history/audit records.

### Tests for User Story 4

- [X] T065 [P] [US4] Add contract tests for POST /leads/{leadId}/notes and GET /leads/{leadId}/history in apps/api/tests/contract/leads-notes-history.contract.test.ts
- [X] T066 [P] [US4] Add unit tests for append-only note rules, exhibition reference validation, source change history, and note metadata sanitization in apps/api/tests/unit/leads-notes-source.test.ts
- [X] T067 [P] [US4] Add integration tests for note addition, denied note access, lead history, exhibition reference changes, source changes, and related events/audit records in apps/api/tests/integration/leads-notes-history.integration.test.ts
- [X] T068 [P] [US4] Add browser tests for notes panel, history timeline, source/exhibition context, denied note state, and activity-scope exclusion copy in apps/web/tests/e2e/leads-notes-history.e2e.ts

### Implementation for User Story 4

- [X] T069 [P] [US4] Implement LeadNoteRepository and LeadHistoryRepository for append-only notes and sanitized history reads in apps/api/src/modules/leads/notes/lead-note.repository.ts
- [X] T070 [P] [US4] Implement LeadExhibitionReferenceRepository for lightweight reference writes and history snapshots in apps/api/src/modules/leads/sources/lead-exhibition-reference.repository.ts
- [X] T071 [US4] Implement LeadNoteService with access checks, stale version checks, audit, history, and LeadNoteAdded event emission in apps/api/src/modules/leads/notes/lead-note.service.ts
- [X] T072 [US4] Implement LeadHistoryService for scoped lead history reads in apps/api/src/modules/leads/notes/lead-history.service.ts
- [X] T073 [US4] Add POST /leads/{leadId}/notes and GET /leads/{leadId}/history endpoint wiring in apps/api/src/modules/leads/leads.controller.ts
- [X] T074 [US4] Add note and history API client methods in apps/web/features/leads/api/leads-client.ts
- [X] T075 [P] [US4] Implement append-only lead notes panel with validation, loading, denied, and conflict states in apps/web/features/leads/components/lead-notes-panel.tsx
- [X] T076 [P] [US4] Implement lead history timeline with assignment, status, source, exhibition, duplicate, stale-update, and note entries in apps/web/features/leads/components/lead-history-timeline.tsx
- [X] T077 [P] [US4] Implement source and exhibition reference editor with name/date/location validation in apps/web/features/leads/components/lead-source-panel.tsx
- [X] T078 [US4] Integrate notes, history, and source/exhibition panels into lead detail page in apps/web/app/(protected)/leads/[leadId]/page.tsx
- [X] T079 [US4] Extend Leads Core verification for notes, history, source, exhibition reference, and activity-scope exclusion checks in packages/test-utils/src/verify-leads-core.ts

**Checkpoint**: All user stories are independently functional and preserve Phase 2 scope boundaries.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, and full validation across all stories.

- [X] T080 [P] Update the API README with Leads Core environment, migration, and verification notes in apps/api/README.md
- [X] T081 [P] Update the web README with protected leads routes and browser validation notes in apps/web/README.md
- [X] T082 [P] Add Leads Core troubleshooting documentation for duplicate, permission, stale update, and search-scale failures in docs/troubleshooting/leads-core.md
- [X] T083 Add Leads Core security documentation for contact data, budget estimates, notes, privacy-safe duplicates, audit records, and domain events in docs/security/leads-core.md
- [X] T084 Run unit tests with pnpm test:unit and fix any Leads Core failures in apps/api/tests/unit/leads-create-validation.test.ts
- [X] T085 Run contract tests with pnpm test:contract and fix any Leads Core failures in apps/api/tests/contract/leads-core.contract.test.ts
- [X] T086 Run integration tests with pnpm test:integration and fix any Leads Core failures in apps/api/tests/integration/leads-create.integration.test.ts
- [ ] T087 Run browser tests with pnpm test:e2e and fix any Leads Core failures in apps/web/tests/e2e/leads-create.e2e.ts
- [X] T088 Run the focused verification with pnpm verify:leads-core and fix any failures in packages/test-utils/src/verify-leads-core.ts
- [X] T089 Run formatting, build, and CI verification with pnpm format:check, pnpm build, and pnpm ci:verify and fix any Leads Core regressions in package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase; delivers MVP lead creation/list/detail.
- **User Story 2 (P1)**: Can start after Foundational phase, but uses leads from US1 for easiest manual validation.
- **User Story 3 (P2)**: Can start after Foundational phase, but status workflows are easiest to validate after US1 creates leads.
- **User Story 4 (P2)**: Can start after Foundational phase, but note/history UI is easiest to validate after US1 detail page exists.

### Within Each User Story

- Write and run failing tests before implementation tasks.
- Implement repositories before services.
- Implement services before controllers.
- Implement API clients before web components.
- Complete story-specific verification before moving to the next priority.

### Parallel Opportunities

- Setup tasks T002, T003, T006, and T007 can run in parallel after T001.
- Foundational tasks T011, T012, T014, T020, T021, and T022 can run in parallel after T008-T010.
- User story test tasks marked [P] can run in parallel within each story.
- Backend repositories and web components marked [P] can run in parallel after their story tests exist.
- US2, US3, and US4 can be staffed in parallel once foundational tasks are complete, with integration checkpoints against US1.

---

## Parallel Example: User Story 1

```bash
Task: "T023 [P] [US1] Add contract tests for POST /leads, GET /leads, GET /leads/{leadId}, and GET /leads/sources in apps/api/tests/contract/leads-create.contract.test.ts"
Task: "T024 [P] [US1] Add unit tests for lead creation validation, contact normalization, source validation, and initial status rules in apps/api/tests/unit/leads-create-validation.test.ts"
Task: "T025 [P] [US1] Add unit tests for platform-wide active duplicate blocking and privacy-safe restricted-match messages in apps/api/tests/unit/leads-duplicate-detection.test.ts"
Task: "T026 [P] [US1] Add integration tests for Admin, Manager, and Sales Representative lead creation and scoped lead listing in apps/api/tests/integration/leads-create.integration.test.ts"
Task: "T027 [P] [US1] Add security-path integration tests for anonymous create, out-of-scope view, and restricted duplicate behavior in apps/api/tests/integration/leads-create-rbac.integration.test.ts"
Task: "T028 [P] [US1] Add browser tests for protected lead list, create form, validation errors, duplicate errors, and permission-denied state in apps/web/tests/e2e/leads-create.e2e.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T040 [P] [US2] Add contract tests for PUT /leads/{leadId}/assignment in apps/api/tests/contract/leads-assignment.contract.test.ts"
Task: "T041 [P] [US2] Add unit tests for assignment eligibility, Manager team-scope rules, Sales Representative denial, and team scope updates in apps/api/tests/unit/leads-assignment-rules.test.ts"
Task: "T042 [P] [US2] Add integration tests for Admin cross-team assignment, Manager in-team assignment, Sales Representative denial, disabled assignee rejection, and assignment history in apps/api/tests/integration/leads-assignment.integration.test.ts"
Task: "T043 [P] [US2] Add browser tests for assignment controls, eligible assignee selection, denied assignment state, and updated owner visibility in apps/web/tests/e2e/leads-assignment.e2e.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T051 [P] [US3] Add contract tests for PUT /leads/{leadId}/status and filtered GET /leads responses in apps/api/tests/contract/leads-status.contract.test.ts"
Task: "T052 [P] [US3] Add unit tests for status transition matrix, Admin/Manager corrections, archive/restore rules, and stale version status updates in apps/api/tests/unit/leads-status-rules.test.ts"
Task: "T053 [P] [US3] Add integration tests for status flow, invalid transitions, correction history, archive/restore, and status event/audit records in apps/api/tests/integration/leads-status.integration.test.ts"
Task: "T054 [P] [US3] Add performance-seeded integration test for 10,000 active lead search/filter/list validation in apps/api/tests/integration/leads-search-scale.integration.test.ts"
Task: "T055 [P] [US3] Add browser tests for status controls, pipeline filters, archive/restore, invalid transition feedback, and list pagination in apps/web/tests/e2e/leads-status-pipeline.e2e.ts"
```

## Parallel Example: User Story 4

```bash
Task: "T065 [P] [US4] Add contract tests for POST /leads/{leadId}/notes and GET /leads/{leadId}/history in apps/api/tests/contract/leads-notes-history.contract.test.ts"
Task: "T066 [P] [US4] Add unit tests for append-only note rules, exhibition reference validation, source change history, and note metadata sanitization in apps/api/tests/unit/leads-notes-source.test.ts"
Task: "T067 [P] [US4] Add integration tests for note addition, denied note access, lead history, exhibition reference changes, source changes, and related events/audit records in apps/api/tests/integration/leads-notes-history.integration.test.ts"
Task: "T068 [P] [US4] Add browser tests for notes panel, history timeline, source/exhibition context, denied note state, and activity-scope exclusion copy in apps/web/tests/e2e/leads-notes-history.e2e.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate create/list/detail, duplicate blocking, scoped access, audit, and LeadCreated event behavior.
5. Demo the protected leads MVP before assignment, status, and notes are added.

### Incremental Delivery

1. Setup + Foundational: Leads module, schema, permissions, audit/events, and contracts ready.
2. US1: Lead creation, duplicate blocking, list/detail, MVP web flow.
3. US2: Assignment and team-scoped ownership.
4. US3: Status pipeline, archive/restore, filters, 10,000 active-lead validation.
5. US4: Append-only notes, source/exhibition context, and lead history.
6. Final Polish: Documentation, security review, full verification, and CI.

### Parallel Team Strategy

1. Team completes Setup and Foundational tasks together.
2. After Foundational completion, one developer owns US1, one owns US2 assignment, one owns US3 status/search, and one owns US4 notes/history.
3. Coordinate shared edits to apps/api/src/modules/leads/leads.controller.ts and apps/web/app/(protected)/leads/[leadId]/page.tsx to avoid same-file conflicts.

---

## Notes

- [P] tasks touch different files and can run in parallel once their prerequisites are met.
- [US1], [US2], [US3], and [US4] map to the user stories in specs/003-leads-core/spec.md.
- Tests must be written first and fail before implementation work begins.
- Each story checkpoint should be validated independently before moving forward.
- Keep later activities, follow-ups, deals, revenue, targets, analytics, notifications, WhatsApp, AI, import/export, and mobile-specific behavior out of Phase 2.
