# Tasks: CRM Front End

**Input**: Design documents from `/specs/002-crm-frontend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-routes.md, quickstart.md

**Tests**: Required by the plan for contact form validation, navigation model behavior, public pages, protected denial, sign-in shell access, responsive navigation, placeholder states, existing module preservation, and WCAG 2.2 AA smoke coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps to user stories from `spec.md`.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish folders and shared frontend files used by later stories.

- [X] T001 Create marketing feature folders in apps/web/features/marketing/components, apps/web/features/marketing/content, and apps/web/features/marketing/validation
- [X] T002 Create workspace feature folders in apps/web/features/workspace/components and apps/web/features/workspace/navigation
- [X] T003 [P] Create frontend shell unit test folder in apps/web/tests/frontend-shell
- [X] T004 [P] Create frontend shell e2e test support notes in apps/web/tests/e2e/frontend-shell-readme.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI configuration, navigation contracts, and reusable primitives that must exist before user story work.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define public route metadata and product content in apps/web/features/marketing/content/product-content.ts
- [X] T006 Define public navigation model in apps/web/features/marketing/components/public-navigation.tsx
- [X] T007 Define workspace destination model preserving existing routes in apps/web/features/workspace/navigation/workspace-destinations.ts
- [X] T008 Implement reusable placeholder state component in apps/web/features/workspace/components/placeholder-state.tsx
- [X] T009 Implement reusable unavailable account state component in apps/web/features/foundation/auth/account-unavailable-state.tsx
- [X] T010 Implement shared accessible skip link and landmark wrapper in apps/web/features/workspace/components/accessibility-frame.tsx
- [X] T011 [P] Add unit tests for public navigation model in apps/web/tests/frontend-shell/public-navigation.test.ts
- [X] T012 [P] Add unit tests for workspace destination preservation rules in apps/web/tests/frontend-shell/workspace-destinations.test.ts
- [X] T013 [P] Add unit tests for account unavailable state copy and links in apps/web/tests/frontend-shell/account-unavailable-state.test.tsx

**Checkpoint**: Shared content, route models, accessibility frame, and placeholder primitives are ready.

---

## Phase 3: User Story 1 - Understand the Product Value (Priority: P1) MVP

**Goal**: Anonymous visitors can understand the product, browse public product pages, and validate a non-persistent contact sales form.

**Independent Test**: Navigate the public site without signing in, verify product identity/value/feature pages/contact page, and validate contact form errors and confirmation.

### Tests for User Story 1

- [X] T014 [P] [US1] Add Playwright public navigation test for landing, features, about, contact, and sign-in links in apps/web/tests/e2e/public-marketing.e2e.ts
- [X] T015 [P] [US1] Add Playwright contact form validation test for empty, malformed email, and valid confirmation states in apps/web/tests/e2e/contact-form.e2e.ts
- [X] T016 [P] [US1] Add Vitest contact validation schema tests in apps/web/tests/frontend-shell/contact-validation.test.ts

### Implementation for User Story 1

- [X] T017 [US1] Implement contact sales validation schema in apps/web/features/marketing/validation/contact-sales-validation.ts
- [X] T018 [US1] Implement public marketing layout component with accessible landmarks in apps/web/features/marketing/components/marketing-layout.tsx
- [X] T019 [US1] Implement landing page sections for hero, problem, solution, features, lifecycle, dashboard preview, and contact CTA in apps/web/app/page.tsx
- [X] T020 [US1] Implement features page with planned CRM feature categories in apps/web/app/features/page.tsx
- [X] T021 [US1] Implement about page with product vision, mission, and platform philosophy in apps/web/app/about/page.tsx
- [X] T022 [US1] Implement contact sales form component with non-persistent confirmation in apps/web/features/marketing/components/contact-sales-form.tsx
- [X] T023 [US1] Implement contact page using the contact sales form in apps/web/app/contact/page.tsx
- [X] T024 [US1] Add public page metadata and accessible page titles in apps/web/app/layout.tsx

**Checkpoint**: User Story 1 is independently testable as the public website MVP.

---

## Phase 4: User Story 2 - Enter the Product Safely (Priority: P1)

**Goal**: Users have clear authentication entry points, protected content remains denied to anonymous visitors, and account lifecycle screens are unavailable placeholders.

**Independent Test**: Access protected routes while signed out, verify denial/sign-in routing, sign in with an authorized user, and confirm account lifecycle placeholders do not change account state.

### Tests for User Story 2

- [X] T025 [P] [US2] Add Playwright protected denial test for dashboard and workspace destinations while signed out in apps/web/tests/e2e/protected-workspace-denial.e2e.ts
- [X] T026 [P] [US2] Add Playwright account lifecycle placeholder test for register, forgot-password, and reset-password in apps/web/tests/e2e/account-placeholders.e2e.ts
- [X] T027 [P] [US2] Add Playwright sign-in workspace access test preserving existing login flow in apps/web/tests/e2e/workspace-auth-shell.e2e.ts

### Implementation for User Story 2

- [X] T028 [US2] Refine sign-in page layout while preserving LoginForm integration in apps/web/app/login/page.tsx
- [X] T029 [US2] Implement register unavailable placeholder page in apps/web/app/register/page.tsx
- [X] T030 [US2] Implement forgot password unavailable placeholder page in apps/web/app/forgot-password/page.tsx
- [X] T031 [US2] Implement reset password unavailable placeholder page in apps/web/app/reset-password/page.tsx
- [X] T032 [US2] Create protected dashboard destination page in apps/web/app/(protected)/dashboard/page.tsx
- [X] T033 [US2] Update protected layout to keep existing auth denial behavior and add workspace shell landmarks in apps/web/app/(protected)/layout.tsx

**Checkpoint**: User Story 2 is independently testable for public/protected separation and safe account placeholders.

---

## Phase 5: User Story 3 - Navigate Future CRM Areas (Priority: P2)

**Goal**: Authenticated users can navigate all planned workspace destinations, existing working module pages are preserved, and missing modules show safe placeholders.

**Independent Test**: Sign in, open every workspace navigation destination, confirm existing working pages remain working, and verify placeholders expose no live business actions.

### Tests for User Story 3

- [X] T034 [P] [US3] Add Playwright workspace navigation test for all planned destinations in apps/web/tests/e2e/workspace-navigation.e2e.ts
- [X] T035 [P] [US3] Add Playwright existing module preservation test for leads, users, teams, audit, and foundation routes in apps/web/tests/e2e/existing-module-preservation.e2e.ts
- [X] T036 [P] [US3] Add Playwright placeholder safety test for activities, exhibitions, deals, targets, analytics, notifications, and settings in apps/web/tests/e2e/module-placeholders.e2e.ts
- [X] T037 [P] [US3] Add Vitest workspace navigation ordering and route mapping tests in apps/web/tests/frontend-shell/workspace-navigation.test.ts

### Implementation for User Story 3

- [X] T038 [US3] Implement workspace navigation component with desktop and mobile states in apps/web/features/workspace/components/workspace-navigation.tsx
- [X] T039 [US3] Integrate workspace navigation and header placeholders into protected layout in apps/web/app/(protected)/layout.tsx
- [X] T040 [US3] Add activities placeholder page in apps/web/app/(protected)/activities/page.tsx
- [X] T041 [US3] Add exhibitions placeholder page in apps/web/app/(protected)/exhibitions/page.tsx
- [X] T042 [US3] Add deals placeholder page in apps/web/app/(protected)/deals/page.tsx
- [X] T043 [US3] Add targets placeholder page in apps/web/app/(protected)/targets/page.tsx
- [X] T044 [US3] Add analytics placeholder page in apps/web/app/(protected)/analytics/page.tsx
- [X] T045 [US3] Add notifications placeholder page in apps/web/app/(protected)/notifications/page.tsx
- [X] T046 [US3] Add team route bridge preserving existing teams behavior in apps/web/app/(protected)/team/page.tsx
- [X] T047 [US3] Add settings placeholder page in apps/web/app/(protected)/settings/page.tsx

**Checkpoint**: User Story 3 is independently testable for complete protected navigation and placeholder safety.

---

## Phase 6: User Story 4 - Recognize a Professional CRM Interface (Priority: P3)

**Goal**: Public and protected screens share a professional, accessible, responsive visual direction suitable for CRM users and future RTL support.

**Independent Test**: Review public and protected core flows for consistent hierarchy, keyboard access, visible focus, labels, contrast, responsive behavior, and RTL-ready layout assumptions.

### Tests for User Story 4

- [X] T048 [P] [US4] Add Playwright responsive layout test for public and protected core routes in apps/web/tests/e2e/responsive-frontend-shell.e2e.ts
- [X] T049 [P] [US4] Add Playwright keyboard navigation and focus visibility smoke test in apps/web/tests/e2e/accessibility-keyboard.e2e.ts
- [X] T050 [P] [US4] Add Playwright contrast and semantic landmark smoke checks for core flows in apps/web/tests/e2e/accessibility-semantics.e2e.ts
- [X] T051 [P] [US4] Add Vitest RTL-readiness assertions for route labels and navigation direction assumptions in apps/web/tests/frontend-shell/rtl-readiness.test.ts

### Implementation for User Story 4

- [X] T052 [US4] Refine global CSS tokens, focus states, typography, and responsive base styles in apps/web/app/globals.css
- [X] T053 [US4] Apply consistent public page hierarchy and CTA styling across apps/web/features/marketing/components/marketing-layout.tsx
- [X] T054 [US4] Apply consistent workspace visual hierarchy and header placeholder treatment in apps/web/features/workspace/components/workspace-navigation.tsx
- [X] T055 [US4] Add accessible status feedback patterns to contact and placeholder components in apps/web/features/marketing/components/contact-sales-form.tsx
- [X] T056 [US4] Verify future RTL-safe logical spacing and alignment in apps/web/app/globals.css

**Checkpoint**: User Story 4 is independently testable for professional UI quality, accessibility, responsiveness, and RTL readiness.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation alignment, and regression checks across stories.

- [X] T057 [P] Update web README with frontend shell routes and validation steps in apps/web/README.md
- [X] T058 [P] Update quickstart notes with any implemented route deviations in specs/002-crm-frontend/quickstart.md
- [X] T059 Run focused web unit tests with pnpm --filter @crm/web test:unit from apps/web/package.json
- [ ] T060 Run focused web e2e tests with pnpm --filter @crm/web test:e2e from apps/web/package.json
- [ ] T061 Run full workspace build with pnpm build from package.json
- [ ] T062 Run full CI verification with pnpm ci:verify from package.json
- [X] T063 Review implemented UI against contracts/ui-routes.md and update specs/002-crm-frontend/contracts/ui-routes.md only if behavior intentionally changed
- [X] T064 Confirm no new backend API, database migration, domain event, queue, persisted contact inquiry, or account lifecycle behavior was added in apps/api and apps/web

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; can run in parallel with US1 after shared components exist, but final validation should account for public navigation from US1.
- **User Story 3 (Phase 5)**: Depends on Foundational and benefits from US2 protected shell work.
- **User Story 4 (Phase 6)**: Depends on at least one public and one protected flow; best completed after US1-US3 implementation.
- **Polish (Phase 7)**: Depends on desired story phases being complete.

### User Story Dependencies

- **US1 Understand Product Value**: Independent MVP after foundational tasks.
- **US2 Enter the Product Safely**: Independent after foundational tasks; uses existing auth behavior.
- **US3 Navigate Future CRM Areas**: Requires protected shell from US2 for complete workspace validation.
- **US4 Recognize a Professional CRM Interface**: Cross-cuts US1-US3 and should validate final UI states.

### Within Each User Story

- Write tests before implementation tasks.
- Implement validation/model code before pages that consume it.
- Implement shared components before route pages that render them.
- Complete story checkpoint before moving to the next priority if working sequentially.

---

## Parallel Opportunities

- T003 and T004 can run in parallel during Setup.
- T011, T012, and T013 can run in parallel after T005-T010 are drafted.
- US1 tests T014-T016 can run in parallel.
- US2 tests T025-T027 can run in parallel.
- US3 tests T034-T037 can run in parallel.
- US3 placeholder pages T040-T047 can run in parallel after T038-T039.
- US4 tests T048-T051 can run in parallel.
- Polish documentation tasks T057 and T058 can run in parallel.

## Parallel Example: User Story 1

```text
Task: "Add Playwright public navigation test for landing, features, about, contact, and sign-in links in apps/web/tests/e2e/public-marketing.e2e.ts"
Task: "Add Playwright contact form validation test for empty, malformed email, and valid confirmation states in apps/web/tests/e2e/contact-form.e2e.ts"
Task: "Add Vitest contact validation schema tests in apps/web/tests/frontend-shell/contact-validation.test.ts"
```

## Parallel Example: User Story 3

```text
Task: "Add activities placeholder page in apps/web/app/(protected)/activities/page.tsx"
Task: "Add exhibitions placeholder page in apps/web/app/(protected)/exhibitions/page.tsx"
Task: "Add deals placeholder page in apps/web/app/(protected)/deals/page.tsx"
Task: "Add targets placeholder page in apps/web/app/(protected)/targets/page.tsx"
Task: "Add analytics placeholder page in apps/web/app/(protected)/analytics/page.tsx"
Task: "Add notifications placeholder page in apps/web/app/(protected)/notifications/page.tsx"
Task: "Add settings placeholder page in apps/web/app/(protected)/settings/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational content, navigation models, and primitives.
3. Complete Phase 3 User Story 1.
4. Validate public website navigation and contact form independently.
5. Stop for review before protected shell expansion if needed.

### Incremental Delivery

1. Deliver US1 public website MVP.
2. Add US2 protected entry and safe account placeholders.
3. Add US3 complete workspace destinations while preserving existing pages.
4. Add US4 visual, responsive, accessibility, and RTL-readiness hardening.
5. Run Phase 7 validation before acceptance.

### Parallel Team Strategy

1. Complete Setup and Foundational tasks together.
2. Assign US1 public marketing, US2 protected entry, and US3 navigation to separate implementers after Phase 2.
3. Keep US4 as the final cross-cutting UI quality pass to avoid repeated visual churn.

---

## Notes

- [P] tasks indicate different files and no dependency on another incomplete task in the same phase.
- Every user story has tests first and can be validated independently.
- Existing working protected pages must be preserved, especially current leads, users, teams, audit, and foundation routes.
- Placeholder pages must not create or expose live CRM records.
- Do not add backend APIs, database migrations, domain events, queues, contact inquiry persistence, or account lifecycle behavior for this feature.
