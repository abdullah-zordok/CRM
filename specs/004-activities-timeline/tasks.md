# Tasks: Activities Timeline

**Input**: Design documents from `/specs/004-activities-timeline/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`,
`quickstart.md`

**Tests**: Contract, integration, unit, security-path, and browser tests are required because this
feature adds protected APIs, persisted workflow state, RBAC/team scoping, audit logs, domain events,
migrations, and user-facing workspace flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase because it touches different files
  and does not depend on incomplete work.
- **[Story]**: User story label for story phases only.
- Every task includes a concrete repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare contracts, module folders, permissions, and test fixture locations used by the
feature.

- [x] T001 Create activities module directories in `apps/api/src/modules/leads/activities/` and `apps/web/features/activities/`
- [x] T002 Add Phase 3 activity route stubs to `apps/web/app/(protected)/activities/page.tsx` and keep the existing placeholder copy until US2/US3 UI tasks replace it
- [x] T003 [P] Add activity permission names and grants for Admin, Manager, and Sales Representative in `apps/api/src/modules/users/permissions/permission-codes.ts`
- [x] T004 [P] Add shared activity contract references to `packages/contracts/openapi.yaml` from `specs/004-activities-timeline/contracts/activities-api.yaml`
- [x] T005 [P] Add activity test factory placeholders in `packages/test-utils/src/activities-timeline-factories.ts`
- [x] T006 [P] Add activity verification command placeholder in `packages/test-utils/src/verify-activities-timeline.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the persistence, validation, module wiring, and shared client foundation that all
user stories depend on.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [x] T007 Create failing API contract coverage for the activity OpenAPI paths in `apps/api/tests/contract/activities-timeline.contract.test.ts`
- [x] T008 [P] Create failing unit tests for activity schema validation and sensitive-note rejection in `apps/api/tests/unit/activities-validation.test.ts`
- [x] T009 [P] Create failing unit tests for activity status and due-state rules in `apps/api/tests/unit/activities-state-rules.test.ts`
- [x] T010 Add Prisma activity models, enums, relationships, and indexes in `apps/api/prisma/schema.prisma`
- [x] T011 Generate the activities migration in `apps/api/prisma/migrations/20260601000000_activities_timeline/migration.sql`
- [x] T012 Add activity domain types and event names in `apps/api/src/modules/leads/activities/activity.types.ts`
- [x] T013 Add activity request/query schemas in `apps/api/src/modules/leads/activities/activity.schemas.ts`
- [x] T014 Add activity DTO mapping and redacted note preview logic in `apps/api/src/modules/leads/activities/activity.dto.ts`
- [x] T015 Add activity repository read/write methods in `apps/api/src/modules/leads/activities/activity.repository.ts`
- [x] T016 Add activity audit service in `apps/api/src/modules/leads/activities/activity-audit.service.ts`
- [x] T017 Add activity event service in `apps/api/src/modules/leads/activities/activity-event.service.ts`
- [x] T018 Extend lead access checks for activity owner/team scope in `apps/api/src/modules/leads/permissions/lead-access.service.ts`
- [x] T019 Wire the activities controller, repository, services, and dependencies into `apps/api/src/modules/leads/leads.module.ts`
- [x] T020 Add web activity API types and request helper foundation in `apps/web/features/activities/api/activities-client.ts`
- [x] T021 Add web activity validation helpers in `apps/web/features/activities/validation/activity-validation.ts`

**Checkpoint**: Persistence, contracts, shared services, permissions, and clients are ready for user
story implementation.

---

## Phase 3: User Story 1 - Record lead activities (Priority: P1) MVP

**Goal**: A permitted user can record a completed customer-facing activity on an accessible lead and
see it in that lead's timeline.

**Independent Test**: Open an accessible lead, create a completed call activity with valid outcome
and time, then verify it appears in chronological context on the lead timeline; denied users cannot
view or create lead activities.

### Tests for User Story 1

- [x] T022 [P] [US1] Add POST `/activities` and GET `/leads/{leadId}/activities` contract assertions in `apps/api/tests/contract/activities-timeline.contract.test.ts`
- [x] T023 [P] [US1] Add integration test for creating a completed lead activity and reading it in the lead timeline in `apps/api/tests/integration/activities-create.integration.test.ts`
- [x] T024 [P] [US1] Add RBAC and lead-scope denial integration tests for activity create/read in `apps/api/tests/integration/activities-access.integration.test.ts`
- [x] T025 [P] [US1] Add audit/event integration assertions for ActivityCreated in `apps/api/tests/integration/activities-audit-events.integration.test.ts`
- [x] T026 [P] [US1] Add web unit tests for completed activity form validation in `apps/web/tests/frontend-shell/activity-form-validation.test.ts`
- [x] T027 [P] [US1] Add Playwright lead timeline create-activity coverage in `apps/web/tests/e2e/activities-timeline.e2e.ts`

### Implementation for User Story 1

- [x] T028 [US1] Implement completed activity creation in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T029 [US1] Implement POST `/activities` and GET `/leads/:leadId/activities` in `apps/api/src/modules/leads/activities/activities.controller.ts`
- [x] T030 [US1] Emit ActivityCreated audit entries and domain events from `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T031 [US1] Add completed activity client functions in `apps/web/features/activities/api/activities-client.ts`
- [x] T032 [P] [US1] Create completed activity form component in `apps/web/features/activities/components/completed-activity-form.tsx`
- [x] T033 [P] [US1] Create lead activity timeline component in `apps/web/features/activities/components/lead-activity-timeline.tsx`
- [x] T034 [US1] Integrate activity timeline and completed activity form into `apps/web/app/(protected)/leads/[leadId]/page.tsx`
- [x] T035 [US1] Add safe loading, empty, validation, denied, and error states for the lead timeline in `apps/web/features/activities/components/lead-activity-timeline.tsx`
- [x] T036 [US1] Add activity timeline styling in `apps/web/app/globals.css`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Manage follow-up work (Priority: P2)

**Goal**: Permitted users can schedule planned follow-ups, identify due/overdue work, complete
follow-ups with outcomes, reassign eligible follow-ups, and cancel planned activities.

**Independent Test**: Create a planned follow-up for an accessible lead, view it as open work,
complete it with an outcome, verify stale updates are rejected, and confirm the completed follow-up
remains visible in lead history.

### Tests for User Story 2

- [x] T037 [P] [US2] Add contract assertions for PUT `/activities/{activityId}/complete`, `/reassign`, and `/cancel` in `apps/api/tests/contract/activities-timeline.contract.test.ts`
- [x] T038 [P] [US2] Add integration tests for scheduling and completing follow-ups in `apps/api/tests/integration/follow-ups-workflow.integration.test.ts`
- [x] T039 [P] [US2] Add integration tests for reassignment, cancellation, archived-lead restriction, and stale version conflicts in `apps/api/tests/integration/follow-ups-state.integration.test.ts`
- [x] T040 [P] [US2] Add RBAC denial tests for follow-up complete/reassign/cancel in `apps/api/tests/integration/follow-ups-access.integration.test.ts`
- [x] T041 [P] [US2] Add unit tests for due-today and overdue calculation in `apps/api/tests/unit/activities-state-rules.test.ts`
- [x] T042 [P] [US2] Add Playwright follow-up scheduling and completion coverage in `apps/web/tests/e2e/follow-ups-workflow.e2e.ts`

### Implementation for User Story 2

- [x] T043 [US2] Implement planned follow-up scheduling in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T044 [US2] Implement complete, reassign, and cancel state transitions with version checks in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T045 [US2] Implement PUT complete/reassign/cancel endpoints in `apps/api/src/modules/leads/activities/activities.controller.ts`
- [x] T046 [US2] Emit FollowUpScheduled, FollowUpCompleted, FollowUpReassigned, and ActivityCanceled audit entries and domain events in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T047 [US2] Add due-state filtering and ordering methods in `apps/api/src/modules/leads/activities/activity.repository.ts`
- [x] T048 [US2] Add follow-up client functions in `apps/web/features/activities/api/activities-client.ts`
- [x] T049 [P] [US2] Create schedule follow-up form in `apps/web/features/activities/components/follow-up-form.tsx`
- [x] T050 [P] [US2] Create follow-up action controls in `apps/web/features/activities/components/follow-up-actions.tsx`
- [x] T051 [US2] Integrate follow-up form and action controls into `apps/web/features/activities/components/lead-activity-timeline.tsx`
- [x] T052 [US2] Add due-today, overdue, completed, and canceled visual states in `apps/web/app/globals.css`

**Checkpoint**: User Stories 1 and 2 both work independently without breaking completed activity
history.

---

## Phase 5: User Story 3 - Review team activity history (Priority: P3)

**Goal**: Managers can review activity and follow-up history across their permitted team scope with
structured filters and navigation back to related leads.

**Independent Test**: Open `/activities` as a manager, filter by team/owner/status/type/due state/date
range, see only permitted records, identify overdue follow-ups within 30 seconds, and navigate to a
related lead without losing review context.

### Tests for User Story 3

- [x] T053 [P] [US3] Add GET `/activities` query contract assertions in `apps/api/tests/contract/activities-timeline.contract.test.ts`
- [x] T054 [P] [US3] Add manager team-scope activity search integration tests in `apps/api/tests/integration/activities-search.integration.test.ts`
- [x] T055 [P] [US3] Add activity workspace permission-denial integration tests in `apps/api/tests/integration/activities-search-access.integration.test.ts`
- [x] T056 [P] [US3] Add web unit tests for activity filter query serialization in `apps/web/tests/frontend-shell/activity-filter-query.test.ts`
- [x] T057 [P] [US3] Add Playwright activities workspace filter and keyboard coverage in `apps/web/tests/e2e/activities-workspace.e2e.ts`

### Implementation for User Story 3

- [x] T058 [US3] Implement activity search query parsing and scope enforcement in `apps/api/src/modules/leads/activities/activity.schemas.ts`
- [x] T059 [US3] Implement scoped activity search service in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T060 [US3] Implement GET `/activities` in `apps/api/src/modules/leads/activities/activities.controller.ts`
- [x] T061 [US3] Add activity workspace search client and hooks in `apps/web/features/activities/hooks/use-activities.ts`
- [x] T062 [P] [US3] Create activity filter panel in `apps/web/features/activities/components/activity-filter-panel.tsx`
- [x] T063 [P] [US3] Create activity workspace list in `apps/web/features/activities/components/activity-workspace-list.tsx`
- [x] T064 [US3] Replace the activities placeholder route with the working workspace in `apps/web/app/(protected)/activities/page.tsx`
- [x] T065 [US3] Preserve filter return context in lead links from `apps/web/features/activities/components/activity-workspace-list.tsx`
- [x] T066 [US3] Update workspace navigation state for the working Activities destination in `apps/web/features/workspace/navigation/workspace-destinations.ts`

**Checkpoint**: All user stories are independently functional and the activities workspace is a
working protected destination.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete verification, documentation, observability, and regression hardening across all
stories.

- [x] T067 [P] Add activities timeline quickstart documentation to `apps/api/README.md` and `apps/web/README.md`
- [x] T068 [P] Add activities security notes to `docs/security/activities-timeline.md`
- [x] T069 [P] Add activities troubleshooting notes to `docs/troubleshooting/activities-timeline.md`
- [x] T070 Add structured logs and metrics review for activity create/search/state-change paths in `apps/api/src/modules/leads/activities/activity.service.ts`
- [x] T071 Add activities verification command to root scripts in `package.json`
- [x] T072 Run `pnpm --filter @crm/api test:contract` and record activities coverage status in `specs/004-activities-timeline/quickstart.md`
- [x] T073 Run `pnpm --filter @crm/api test:unit` and record activities domain-rule status in `specs/004-activities-timeline/quickstart.md`
- [x] T074 Run `pnpm --filter @crm/api test:integration` and record activities workflow status in `specs/004-activities-timeline/quickstart.md`
- [x] T075 Run `pnpm --filter @crm/web test:unit` and record activities UI logic status in `specs/004-activities-timeline/quickstart.md`
- [x] T076 Run `pnpm --filter @crm/web test:e2e` and record activities browser-flow status in `specs/004-activities-timeline/quickstart.md`
- [x] T077 Run `pnpm build` and record full workspace build status in `specs/004-activities-timeline/quickstart.md`
- [x] T078 Run `pnpm exec prettier --check .` and fix formatting issues in changed files under `apps/`, `packages/`, and `specs/004-activities-timeline/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and uses the lead timeline from
  US1 for full demo value, but API follow-up workflows can be tested independently.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and benefits from US1/US2 data,
  but scoped activity search can be tested independently with seeded/factory records.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Record lead activities**: MVP; no dependency on US2 or US3.
- **US2 Manage follow-up work**: Extends the same Activity entity and services; can start after
  Foundation, but UI integration is simpler after US1 timeline exists.
- **US3 Review team activity history**: Uses shared search and filter foundation; can start after
  Foundation with factory records, then integrate naturally with US1/US2 outputs.

### Within Each User Story

- Write tests first and confirm they fail before implementing.
- Schema and repository work precede service logic.
- Service logic precedes controllers and web clients.
- API/web clients precede UI components.
- UI components precede route integration.
- Story checkpoint validation happens before moving to the next priority.

## Parallel Opportunities

- T003, T004, T005, and T006 can run in parallel after T001.
- T008 and T009 can run in parallel with T007 because they are separate test files.
- US1 test tasks T022 through T027 can run in parallel after Foundation.
- US1 UI component tasks T032 and T033 can run in parallel after T031.
- US2 test tasks T037 through T042 can run in parallel after Foundation.
- US2 component tasks T049 and T050 can run in parallel after T048.
- US3 test tasks T053 through T057 can run in parallel after Foundation.
- US3 component tasks T062 and T063 can run in parallel after T061.
- Polish documentation tasks T067, T068, and T069 can run in parallel.

## Parallel Example: User Story 1

```text
Task: "T022 [US1] Add POST /activities and GET /leads/{leadId}/activities contract assertions"
Task: "T023 [US1] Add integration test for creating a completed lead activity"
Task: "T024 [US1] Add RBAC and lead-scope denial integration tests"
Task: "T026 [US1] Add web unit tests for completed activity form validation"
Task: "T027 [US1] Add Playwright lead timeline create-activity coverage"
```

## Parallel Example: User Story 2

```text
Task: "T037 [US2] Add contract assertions for follow-up state endpoints"
Task: "T038 [US2] Add integration tests for scheduling and completing follow-ups"
Task: "T039 [US2] Add integration tests for reassignment, cancellation, archived lead, and stale version"
Task: "T041 [US2] Add unit tests for due-today and overdue calculation"
Task: "T042 [US2] Add Playwright follow-up scheduling and completion coverage"
```

## Parallel Example: User Story 3

```text
Task: "T053 [US3] Add GET /activities query contract assertions"
Task: "T054 [US3] Add manager team-scope activity search integration tests"
Task: "T055 [US3] Add activity workspace permission-denial integration tests"
Task: "T056 [US3] Add web unit tests for activity filter query serialization"
Task: "T057 [US3] Add Playwright activities workspace filter and keyboard coverage"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup tasks.
2. Complete Phase 2 foundational persistence, validation, RBAC, audit, events, and clients.
3. Complete Phase 3 for completed activity recording and lead timeline display.
4. Stop and validate US1 independently with contract, integration, unit, and browser tests.

### Incremental Delivery

1. Deliver US1 as the MVP for completed lead activity history.
2. Add US2 for planned follow-ups, completion, reassignment, cancellation, and stale update handling.
3. Add US3 for manager/team activity review and workspace filtering.
4. Run polish verification after each story if the branch is used for partial delivery.

### Parallel Team Strategy

1. One developer completes Prisma/schema/module foundation while another writes failing contract and
   integration tests.
2. After Phase 2, split by story: US1 lead timeline, US2 follow-up lifecycle, US3 workspace search.
3. Coordinate shared files carefully: `activity.service.ts`, `activities.controller.ts`,
   `activities-client.ts`, and `globals.css` should have one active owner at a time.

## Notes

- `[P]` tasks touch separate files and can be worked in parallel after their prerequisites.
- `[US1]`, `[US2]`, and `[US3]` map directly to the prioritized spec user stories.
- Contract, integration, unit, security-path, and browser tests are intentionally included because
  the constitution requires them for this feature.
- Commit after each completed phase or logical group.
