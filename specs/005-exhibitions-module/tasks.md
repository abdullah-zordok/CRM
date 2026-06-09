# Tasks: Exhibitions Module

**Input**: Design documents from `/specs/005-exhibitions-module/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`,
`quickstart.md`

**Tests**: Contract, integration, unit, security-path, migration, event, and browser tests are
required because this feature adds protected APIs, persisted CRM state, RBAC/team scoping,
attendance and attribution workflows, audit logs, domain events, migrations, and protected
workspace UI.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated
independently. Complete Phase 1 and Phase 2 before starting any user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase because it touches different files
  and does not depend on incomplete work.
- **[Story]**: User story label for story phases only.
- Every task includes a concrete repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare module folders, contracts, permissions, test utilities, and route placeholders
used by every story.

- [x] T001 Create exhibitions API module directory in `apps/api/src/modules/exhibitions/`
- [x] T002 Create exhibitions web feature directories in `apps/web/features/exhibitions/api/`, `apps/web/features/exhibitions/components/`, `apps/web/features/exhibitions/hooks/`, and `apps/web/features/exhibitions/validation/`
- [x] T003 Add Phase 4 exhibitions route placeholder wiring in `apps/web/app/(protected)/exhibitions/page.tsx` and keep current placeholder behavior until US4 replaces it
- [x] T004 [P] Add exhibition permission codes and grants for Admin, Manager, and Sales Representative in `apps/api/src/modules/users/permissions/permission-codes.ts`
- [x] T005 [P] Add Phase 4 exhibition OpenAPI references from `specs/005-exhibitions-module/contracts/exhibitions-api.yaml` to `packages/contracts/openapi.yaml`
- [x] T006 [P] Add exhibition test factories in `packages/test-utils/src/exhibitions-module-factories.ts`
- [x] T007 [P] Add exhibition contract/event verifier in `packages/test-utils/src/verify-exhibitions-module.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the persistence, validation, RBAC helper, audit/event foundation, API wiring, and
web client foundation that all user stories depend on.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [x] T008 Create failing API contract coverage for all exhibition paths in `apps/api/tests/contract/exhibitions-module.contract.test.ts`
- [x] T009 [P] Create failing unit tests for exhibition create/update/date/status/note validation in `apps/api/tests/unit/exhibitions-validation.test.ts`
- [x] T010 [P] Create failing unit tests for exhibition lifecycle, archive/restore, and stale update rules in `apps/api/tests/unit/exhibitions-state-rules.test.ts`
- [x] T011 [P] Create failing unit tests for exhibition scope and permission helper rules in `apps/api/tests/unit/exhibitions-access-rules.test.ts`
- [x] T012 Add Exhibition, ExhibitionAttendee, ExhibitionLeadAttribution, ExhibitionHistoryEntry, ExhibitionAccessDecision, and ExhibitionDomainEvent models/enums/indexes in `apps/api/prisma/schema.prisma`
- [x] T013 Generate the exhibitions migration in `apps/api/prisma/migrations/20260602000000_exhibitions_module/migration.sql`
- [x] T014 Add exhibition domain types, status constants, permission action types, and event names in `apps/api/src/modules/exhibitions/exhibition.types.ts`
- [x] T015 Add exhibition request/query schemas in `apps/api/src/modules/exhibitions/exhibition.schemas.ts`
- [x] T016 Add exhibition DTO mappers and summary redaction helpers in `apps/api/src/modules/exhibitions/exhibition.dto.ts`
- [x] T017 Add exhibition repository methods for create, find, update, archive, restore, search, attendee, attribution, history, and summary reads in `apps/api/src/modules/exhibitions/exhibition.repository.ts`
- [x] T018 Add exhibition access service for Admin, Manager, Sales Representative, team, attendee, and lead-scope decisions in `apps/api/src/modules/exhibitions/exhibition-access.service.ts`
- [x] T019 Add exhibition audit service that writes exhibition history and security audit records in `apps/api/src/modules/exhibitions/exhibition-audit.service.ts`
- [x] T020 Add exhibition event service for ExhibitionCreated, ExhibitionUpdated, ExhibitionStatusChanged, ExhibitionAttendeeAssigned, ExhibitionAttendanceConfirmed, ExhibitionLeadAttributed, and ExhibitionAttributionCorrected in `apps/api/src/modules/exhibitions/exhibition-event.service.ts`
- [x] T021 Add exhibition service skeleton with dependency injection and shared helpers in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T022 Add exhibitions controller skeleton with protected route methods in `apps/api/src/modules/exhibitions/exhibitions.controller.ts`
- [x] T023 Add exhibitions Nest module and observability constants in `apps/api/src/modules/exhibitions/exhibitions.module.ts`
- [x] T024 Register `ExhibitionsModule` in `apps/api/src/app.module.ts`
- [x] T025 Extend lead domain types and history/event names for full exhibition attribution in `apps/api/src/modules/leads/leads.types.ts`
- [x] T026 Extend lead repository/detail DTO support for full exhibition attribution context in `apps/api/src/modules/leads/leads.repository.ts` and `apps/api/src/modules/leads/leads.dto.ts`
- [x] T027 Add web exhibition API types and request helpers in `apps/web/features/exhibitions/api/exhibitions-client.ts`
- [x] T028 Add web exhibition validation helpers in `apps/web/features/exhibitions/validation/exhibitions-validation.ts`
- [x] T029 Add exhibition module README stub in `docs/troubleshooting/exhibitions-module.md`

**Checkpoint**: Persistence, contracts, permissions, audit/events, API wiring, and web client
foundation are ready for story work.

---

## Phase 3: User Story 1 - Manage Exhibition Records (Priority: P1) MVP

**Goal**: Authorized managers/admins can create, update, archive, restore, search, and view
exhibition records while denied users cannot mutate restricted records.

**Independent Test**: Sign in as an authorized manager, create a valid exhibition, edit planning
fields, archive and restore it, search for it in scope, and verify unauthorized users are denied
without restricted details.

### Tests for User Story 1

- [x] T030 [P] [US1] Add contract assertions for GET `/exhibitions`, POST `/exhibitions`, GET `/exhibitions/{exhibitionId}`, PATCH `/exhibitions/{exhibitionId}`, PUT `/archive`, and PUT `/restore` in `apps/api/tests/contract/exhibitions-module.contract.test.ts`
- [x] T031 [P] [US1] Add integration tests for exhibition create, detail, search, update, archive, and restore in `apps/api/tests/integration/exhibitions-management.integration.test.ts`
- [x] T032 [P] [US1] Add RBAC and team-scope denial integration tests for exhibition management in `apps/api/tests/integration/exhibitions-access.integration.test.ts`
- [x] T033 [P] [US1] Add audit/event integration assertions for ExhibitionCreated, ExhibitionUpdated, and ExhibitionStatusChanged in `apps/api/tests/integration/exhibitions-audit-events.integration.test.ts`
- [x] T034 [P] [US1] Add web unit tests for exhibition form validation in `apps/web/tests/frontend-shell/exhibition-form-validation.test.ts`
- [x] T035 [P] [US1] Add Playwright coverage for creating, editing, archiving, and restoring an exhibition in `apps/web/tests/e2e/exhibitions-management.e2e.ts`

### Implementation for User Story 1

- [x] T036 [US1] Implement exhibition create, detail, update, archive, restore, and search methods in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T037 [US1] Implement GET `/exhibitions`, POST `/exhibitions`, GET `/exhibitions/:exhibitionId`, PATCH `/exhibitions/:exhibitionId`, PUT `/archive`, and PUT `/restore` in `apps/api/src/modules/exhibitions/exhibitions.controller.ts`
- [x] T038 [US1] Enforce exhibition lifecycle, stale version, date range, owner eligibility, archive, and restore rules in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T039 [US1] Emit ExhibitionCreated, ExhibitionUpdated, and ExhibitionStatusChanged audit records and domain events in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T040 [US1] Add exhibition create/update/archive/restore/search client functions in `apps/web/features/exhibitions/api/exhibitions-client.ts`
- [x] T041 [P] [US1] Create exhibition form component with validation and safe error states in `apps/web/features/exhibitions/components/exhibition-form.tsx`
- [x] T042 [P] [US1] Create exhibition lifecycle actions component in `apps/web/features/exhibitions/components/exhibition-lifecycle-actions.tsx`
- [x] T043 [P] [US1] Create exhibition list component for scoped search results in `apps/web/features/exhibitions/components/exhibition-list.tsx`
- [x] T044 [P] [US1] Create exhibition detail shell component for overview/status/history slots in `apps/web/features/exhibitions/components/exhibition-detail-shell.tsx`
- [x] T045 [US1] Create exhibition data hook for list/detail mutations in `apps/web/features/exhibitions/hooks/use-exhibitions.ts`
- [x] T046 [US1] Add protected exhibition detail route in `apps/web/app/(protected)/exhibitions/[exhibitionId]/page.tsx`
- [x] T047 [US1] Integrate create/search/list workflow into `apps/web/app/(protected)/exhibitions/page.tsx`
- [x] T048 [US1] Add exhibition management styling in `apps/web/app/globals.css`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Track Representative Attendance (Priority: P1)

**Goal**: Managers/admins can assign eligible representatives to exhibitions and permitted users can
confirm attendance with correction history.

**Independent Test**: Assign five active representatives to a planned exhibition, confirm
attendance for one representative, reject disabled/out-of-scope attendees, and verify finalized
attendance corrections preserve prior state.

### Tests for User Story 2

- [x] T049 [P] [US2] Add contract assertions for POST `/exhibitions/{exhibitionId}/attendees` and PUT `/exhibitions/{exhibitionId}/attendees/{attendeeId}/confirm` in `apps/api/tests/contract/exhibitions-module.contract.test.ts`
- [x] T050 [P] [US2] Add integration tests for attendee assignment, duplicate prevention, removal, and attendance confirmation in `apps/api/tests/integration/exhibition-attendance.integration.test.ts`
- [x] T051 [P] [US2] Add integration tests for disabled user, manager team-scope, sales representative denial, archived exhibition denial, and stale attendance updates in `apps/api/tests/integration/exhibition-attendance-access.integration.test.ts`
- [x] T052 [P] [US2] Add audit/event integration assertions for ExhibitionAttendeeAssigned and ExhibitionAttendanceConfirmed in `apps/api/tests/integration/exhibition-attendance-audit-events.integration.test.ts`
- [x] T053 [P] [US2] Add web unit tests for attendee assignment and attendance confirmation validation in `apps/web/tests/frontend-shell/exhibition-attendance-validation.test.ts`
- [x] T054 [P] [US2] Add Playwright coverage for attendee assignment and attendance confirmation in `apps/web/tests/e2e/exhibition-attendance.e2e.ts`

### Implementation for User Story 2

- [x] T055 [US2] Implement attendee assignment, attendee removal/correction, and attendance confirmation service methods in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T056 [US2] Implement POST `/exhibitions/:exhibitionId/attendees` and PUT `/exhibitions/:exhibitionId/attendees/:attendeeId/confirm` in `apps/api/src/modules/exhibitions/exhibitions.controller.ts`
- [x] T057 [US2] Enforce attendee eligibility, duplicate attendee prevention, team scope, archived exhibition denial, stale version, and finalized correction rules in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T058 [US2] Emit ExhibitionAttendeeAssigned and ExhibitionAttendanceConfirmed audit records and domain events in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T059 [US2] Add attendee assignment and attendance confirmation client functions in `apps/web/features/exhibitions/api/exhibitions-client.ts`
- [x] T060 [P] [US2] Create attendee assignment component in `apps/web/features/exhibitions/components/exhibition-attendee-panel.tsx`
- [x] T061 [P] [US2] Create attendance confirmation controls in `apps/web/features/exhibitions/components/attendance-confirmation-actions.tsx`
- [x] T062 [US2] Integrate attendee panel into exhibition detail route in `apps/web/app/(protected)/exhibitions/[exhibitionId]/page.tsx`
- [x] T063 [US2] Add attendance status and correction styling in `apps/web/app/globals.css`

**Checkpoint**: User Stories 1 and 2 both work independently for event records and attendance.

---

## Phase 5: User Story 3 - Attribute Leads To Exhibitions (Priority: P2)

**Goal**: Permitted users can link accessible leads to exhibitions, reconcile Phase 2 lightweight
references, correct attribution, and see exhibition context on lead detail.

**Independent Test**: Link an accessible lead with a lightweight exhibition reference to a full
exhibition, preserve original reference history, correct the attribution, and verify out-of-scope
lead/exhibition links are denied safely.

### Tests for User Story 3

- [x] T064 [P] [US3] Add contract assertions for POST `/exhibitions/{exhibitionId}/lead-attributions` and PATCH `/exhibitions/{exhibitionId}/lead-attributions/{attributionId}` in `apps/api/tests/contract/exhibitions-module.contract.test.ts`
- [x] T065 [P] [US3] Add integration tests for lead attribution, lightweight reference preservation, attribution correction, and removal in `apps/api/tests/integration/exhibition-attribution.integration.test.ts`
- [x] T066 [P] [US3] Add integration tests for lead scope denial, exhibition scope denial, archived exhibition denial, and stale attribution updates in `apps/api/tests/integration/exhibition-attribution-access.integration.test.ts`
- [x] T067 [P] [US3] Add audit/event integration assertions for ExhibitionLeadAttributed and ExhibitionAttributionCorrected in `apps/api/tests/integration/exhibition-attribution-audit-events.integration.test.ts`
- [x] T068 [P] [US3] Add web unit tests for attribution form and correction validation in `apps/web/tests/frontend-shell/exhibition-attribution-validation.test.ts`
- [x] T069 [P] [US3] Add Playwright coverage for linking a lead to an exhibition and seeing the link on lead detail in `apps/web/tests/e2e/exhibition-attribution.e2e.ts`

### Implementation for User Story 3

- [x] T070 [US3] Implement lead attribution, reference reconciliation, attribution correction, and attribution removal service methods in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T071 [US3] Implement POST `/exhibitions/:exhibitionId/lead-attributions` and PATCH `/exhibitions/:exhibitionId/lead-attributions/:attributionId` in `apps/api/src/modules/exhibitions/exhibitions.controller.ts`
- [x] T072 [US3] Enforce lead access, exhibition access, archived exhibition denial, active attribution uniqueness, stale version, and correction-history rules in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T073 [US3] Emit ExhibitionLeadAttributed and ExhibitionAttributionCorrected audit records, lead history entries, and domain events in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T074 [US3] Add full exhibition attribution client functions in `apps/web/features/exhibitions/api/exhibitions-client.ts`
- [x] T075 [P] [US3] Create lead attribution panel for exhibition detail in `apps/web/features/exhibitions/components/exhibition-attribution-panel.tsx`
- [x] T076 [P] [US3] Create attribution correction controls in `apps/web/features/exhibitions/components/attribution-correction-actions.tsx`
- [x] T077 [US3] Integrate attribution panel into exhibition detail route in `apps/web/app/(protected)/exhibitions/[exhibitionId]/page.tsx`
- [x] T078 [US3] Add exhibition attribution context to lead detail page in `apps/web/app/(protected)/leads/[leadId]/page.tsx`
- [x] T079 [US3] Add attribution status and lightweight-reference reconciliation styling in `apps/web/app/globals.css`

**Checkpoint**: User Stories 1, 2, and 3 work independently for records, attendance, and lead
attribution.

---

## Phase 6: User Story 4 - Review Exhibition Performance (Priority: P3)

**Goal**: Managers/admins can review scoped exhibition summaries with attributed lead counts, lead
status distribution, attendee participation, open follow-ups, overdue follow-ups, and recent
activity indicators.

**Independent Test**: Open the exhibitions workspace as a manager, filter by status/date/location/
team/attendee, inspect a permitted exhibition summary, verify only scoped metrics appear, and verify
empty states for exhibitions without attributed leads.

### Tests for User Story 4

- [x] T080 [P] [US4] Add contract assertions for GET `/exhibitions/{exhibitionId}/summary` and search query parameters in `apps/api/tests/contract/exhibitions-module.contract.test.ts`
- [x] T081 [P] [US4] Add integration tests for scoped exhibition summary counts and lead status distribution in `apps/api/tests/integration/exhibition-summary.integration.test.ts`
- [x] T082 [P] [US4] Add integration tests for manager team-scope summary denial and hidden out-of-scope metrics in `apps/api/tests/integration/exhibition-summary-access.integration.test.ts`
- [x] T083 [P] [US4] Add unit tests for summary calculation helpers and empty-state summary rules in `apps/api/tests/unit/exhibition-summary-rules.test.ts`
- [x] T084 [P] [US4] Add web unit tests for exhibition filter query serialization in `apps/web/tests/frontend-shell/exhibition-filter-query.test.ts`
- [x] T085 [P] [US4] Add Playwright coverage for exhibitions workspace filters, summary review, empty states, and keyboard flow in `apps/web/tests/e2e/exhibitions-workspace.e2e.ts`

### Implementation for User Story 4

- [x] T086 [US4] Implement scoped exhibition search filters and summary service methods in `apps/api/src/modules/exhibitions/exhibition.service.ts`
- [x] T087 [US4] Implement GET `/exhibitions/:exhibitionId/summary` and complete query parsing for GET `/exhibitions` in `apps/api/src/modules/exhibitions/exhibitions.controller.ts`
- [x] T088 [US4] Implement summary repository query support for attributed lead count, status distribution, attendee count, open follow-ups, overdue follow-ups, and recent activity in `apps/api/src/modules/exhibitions/exhibition.repository.ts`
- [x] T089 [US4] Add summary and filter client functions in `apps/web/features/exhibitions/api/exhibitions-client.ts`
- [x] T090 [US4] Add exhibition workspace hook with filter state and safe loading/error handling in `apps/web/features/exhibitions/hooks/use-exhibition-workspace.ts`
- [x] T091 [P] [US4] Create exhibition filter panel in `apps/web/features/exhibitions/components/exhibition-filter-panel.tsx`
- [x] T092 [P] [US4] Create exhibition performance summary component in `apps/web/features/exhibitions/components/exhibition-performance-summary.tsx`
- [x] T093 [P] [US4] Create exhibition history timeline component in `apps/web/features/exhibitions/components/exhibition-history-timeline.tsx`
- [x] T094 [US4] Replace the exhibitions placeholder route with working workspace in `apps/web/app/(protected)/exhibitions/page.tsx`
- [x] T095 [US4] Integrate summary and history components into exhibition detail route in `apps/web/app/(protected)/exhibitions/[exhibitionId]/page.tsx`
- [x] T096 [US4] Update workspace navigation state for the working Exhibitions destination in `apps/web/features/workspace/navigation/workspace-destinations.ts`
- [x] T097 [US4] Add exhibition workspace, filter, summary, history, empty, denied, and keyboard-focus styling in `apps/web/app/globals.css`

**Checkpoint**: All user stories are independently functional and the Exhibitions workspace is a
working protected destination.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Complete verification, documentation, observability, and regression hardening across
all stories.

- [x] T098 [P] Add Exhibitions Module quickstart documentation to `apps/api/README.md` and `apps/web/README.md`
- [x] T099 [P] Add exhibitions security notes to `docs/security/exhibitions-module.md`
- [x] T100 [P] Complete exhibitions troubleshooting notes in `docs/troubleshooting/exhibitions-module.md`
- [x] T101 Add structured logs and metrics review for exhibition create/search/attendance/attribution/summary paths in `apps/api/src/modules/exhibitions/exhibitions.module.ts`
- [x] T102 Add exhibitions verification command to root scripts in `package.json`
- [x] T103 Run `pnpm --filter @crm/api test:contract` and record exhibitions contract status in `specs/005-exhibitions-module/quickstart.md`
- [x] T104 Run `pnpm --filter @crm/api test:unit` and record exhibitions validation/state/summary status in `specs/005-exhibitions-module/quickstart.md`
- [x] T105 Run `pnpm --filter @crm/api test:integration` and record exhibitions workflow status in `specs/005-exhibitions-module/quickstart.md`
- [x] T106 Run `pnpm --filter @crm/web test:unit` and record exhibitions UI logic status in `specs/005-exhibitions-module/quickstart.md`
- [x] T107 Run `pnpm --filter @crm/web test:e2e` and record exhibitions browser-flow status in `specs/005-exhibitions-module/quickstart.md`
- [x] T108 Run `pnpm verify:exhibitions-module` and record verifier status in `specs/005-exhibitions-module/quickstart.md`
- [x] T109 Run `pnpm build` and record full workspace build status in `specs/005-exhibitions-module/quickstart.md`
- [x] T110 Run `pnpm exec prettier --check .` and fix formatting issues in changed files under `apps/`, `packages/`, `docs/`, and `specs/005-exhibitions-module/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and a visible exhibition from US1
  for the best demo, but attendance rules can be unit/integration tested independently with factory
  exhibitions.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and uses leads from Phase 2 plus
  exhibitions from US1, but attribution rules can be tested independently with factory records.
- **User Story 4 (Phase 6)**: Depends on Foundational completion and benefits from US1/US2/US3
  records, but scoped summary can be tested independently with factory records.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Manage Exhibition Records**: MVP; no dependency on US2, US3, or US4.
- **US2 Track Representative Attendance**: Extends Exhibition with attendee records; can start
  after Foundation with factory exhibitions.
- **US3 Attribute Leads To Exhibitions**: Extends Exhibition and Lead integration; can start after
  Foundation with factory exhibitions and leads.
- **US4 Review Exhibition Performance**: Uses Exhibition, attendance, attribution, leads, and
  activities; can start after Foundation with factory data but is most valuable after US1-US3.

### Within Each User Story

- Write tests first and confirm they fail before implementing.
- Schemas and repository methods precede service logic.
- Service logic precedes controllers and web clients.
- API/web clients precede UI components.
- UI components precede route integration.
- Story checkpoint validation happens before moving to the next priority.

## Parallel Opportunities

- T004, T005, T006, and T007 can run in parallel after T001-T003.
- T009, T010, and T011 can run in parallel with T008 because they are separate test files.
- T014, T015, T016, T018, T019, and T020 can run in parallel after T012-T013 planning decisions
  are stable, but wire them sequentially through T021-T024.
- US1 test tasks T030 through T035 can run in parallel after Foundation.
- US1 UI component tasks T041 through T044 can run in parallel after T040.
- US2 test tasks T049 through T054 can run in parallel after Foundation.
- US2 UI component tasks T060 and T061 can run in parallel after T059.
- US3 test tasks T064 through T069 can run in parallel after Foundation.
- US3 UI component tasks T075 and T076 can run in parallel after T074.
- US4 test tasks T080 through T085 can run in parallel after Foundation.
- US4 component tasks T091 through T093 can run in parallel after T090.
- Polish documentation tasks T098, T099, and T100 can run in parallel.

## Parallel Example: User Story 1

```text
Task: "T030 [US1] Add contract assertions for exhibition management endpoints"
Task: "T031 [US1] Add integration tests for exhibition create/detail/search/update/archive/restore"
Task: "T032 [US1] Add RBAC and team-scope denial integration tests"
Task: "T034 [US1] Add web unit tests for exhibition form validation"
Task: "T035 [US1] Add Playwright coverage for exhibition management"
```

## Parallel Example: User Story 2

```text
Task: "T049 [US2] Add contract assertions for attendee endpoints"
Task: "T050 [US2] Add integration tests for attendee assignment and attendance confirmation"
Task: "T051 [US2] Add access denial and stale update integration tests"
Task: "T053 [US2] Add web unit tests for attendance validation"
Task: "T054 [US2] Add Playwright attendance coverage"
```

## Parallel Example: User Story 3

```text
Task: "T064 [US3] Add contract assertions for attribution endpoints"
Task: "T065 [US3] Add integration tests for attribution and reference preservation"
Task: "T066 [US3] Add access denial and stale attribution integration tests"
Task: "T068 [US3] Add web unit tests for attribution validation"
Task: "T069 [US3] Add Playwright attribution coverage"
```

## Parallel Example: User Story 4

```text
Task: "T080 [US4] Add contract assertions for summary and search filters"
Task: "T081 [US4] Add integration tests for scoped summary counts"
Task: "T082 [US4] Add integration tests for hidden out-of-scope metrics"
Task: "T083 [US4] Add unit tests for summary calculation helpers"
Task: "T085 [US4] Add Playwright workspace and summary coverage"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup tasks.
2. Complete Phase 2 foundational persistence, validation, RBAC, audit, events, and clients.
3. Complete Phase 3 for exhibition record management.
4. Stop and validate US1 independently with contract, integration, unit, and browser tests.

### Incremental Delivery

1. Deliver US1 as the MVP for first-class exhibition records.
2. Add US2 for representative attendance.
3. Add US3 for lead attribution and lightweight-reference reconciliation.
4. Add US4 for scoped performance summaries and complete workspace review.
5. Run polish verification after each story if the branch is used for partial delivery.

### Smaller-Model Implementation Guidance

1. Do not skip Setup or Foundational phases; later tasks assume those files exist.
2. Before editing a shared file such as `schema.prisma`, `exhibition.service.ts`,
   `exhibitions.controller.ts`, `exhibitions-client.ts`, or `globals.css`, read the existing
   activity and lead implementations and follow the same local patterns.
3. Keep each task scoped to the listed file path. If a task requires a helper in another file, add
   that helper only when the task explicitly mentions that file or a later task depends on it.
4. Do not implement out-of-scope revenue ROI, commissions, target calculations, notifications, AI,
   import/export, or mobile workflows.
5. After each checkpoint, run the focused tests for that story before continuing.

## Notes

- `[P]` tasks touch separate files and can be worked in parallel after their prerequisites.
- `[US1]`, `[US2]`, `[US3]`, and `[US4]` map directly to the prioritized spec user stories.
- Contract, integration, unit, security-path, migration, event, and browser tests are intentionally
  included because the constitution requires them for this feature.
- Commit after each completed phase or logical group.
