# Research: CRM Front End

## Decision: Keep This Feature Frontend-Only

**Rationale**: The spec requires product presence, authentication entry points,
workspace navigation, placeholders, responsive layout, and accessibility. It
explicitly excludes CRM business operations, contact sales persistence, account
lifecycle workflows, analytics, notifications, AI, and integrations. Keeping the
scope in `apps/web` reduces risk and protects existing backend capability
boundaries.

**Alternatives considered**:

- Add backend contact inquiry persistence. Rejected because the spec says
  contact sales input is validation-only and must not create CRM records.
- Add account registration and password reset behavior. Rejected because
  clarification made these entry-only placeholders.

## Decision: Preserve Existing Protected Module Pages

**Rationale**: The current app already contains working protected users, teams,
audit, foundation, and leads pages. Replacing them with placeholders would
regress implemented capabilities. The workspace navigation should route to
existing pages when present and use placeholders only for missing modules.

**Alternatives considered**:

- Replace every protected destination with a placeholder. Rejected because it
  conflicts with the clarification and risks losing working behavior.
- Limit the shell to dashboard only. Rejected because the spec requires planned
  CRM module destinations.

## Decision: Public Website Uses Explicit Product Pages

**Rationale**: Public visitors need to understand product value, feature areas,
vision, and contact sales information within three user actions. Dedicated
landing, features, about, and contact pages give clear acceptance targets and
avoid mixing public marketing content with protected CRM surfaces.

**Alternatives considered**:

- Single long landing page only. Rejected because the spec requires public
  product pages beyond the entry page.
- Marketing content inside protected shell. Rejected because anonymous visitors
  must be able to evaluate the product before sign-in.

## Decision: Contact Sales Is Client-Validated and Non-Persistent

**Rationale**: The contact form is valuable for demonstrating the public sales
workflow, but this feature must not add persistence, notifications, lead
creation, or sales routing. Validation and non-persistent confirmation satisfy
the user-facing requirement without changing backend behavior.

**Alternatives considered**:

- Submit inquiries to the API. Rejected because no persistence or routing is in
  scope.
- Remove the form and show only contact text. Rejected because FR-004 and FR-005
  require form fields and validation.

## Decision: Responsive Workspace Navigation With Future RTL Safety

**Rationale**: The shell must work across desktop, tablet, and mobile-sized
screens, and clarification requires English content now while avoiding
English-only positioning assumptions. Navigation should use logical layout
patterns, readable labels, and compact mobile behavior so future RTL support does
not require structural redesign.

**Alternatives considered**:

- Desktop-only sidebar. Rejected because responsive support is required.
- Implement full Arabic localization now. Rejected because clarification limits
  this feature to English content with RTL-ready structure.

## Decision: WCAG 2.2 AA Acceptance Target

**Rationale**: WCAG 2.2 AA creates clear validation criteria for keyboard
navigation, focus visibility, labels, contrast, and status feedback. It matches
business software expectations and prevents vague accessibility acceptance.

**Alternatives considered**:

- Basic accessibility only. Rejected because it is too vague for acceptance
  tests.
- Full audit coverage for every page state. Deferred because this phase only
  requires core public and protected flows.

## Decision: UI Route Contract Instead of Backend API Contract

**Rationale**: This feature exposes user-facing routes and UI states rather than
new backend endpoints. A route/state contract is the most useful artifact for
planning tests and preserving existing module pages.

**Alternatives considered**:

- OpenAPI contract. Rejected because no new API endpoints are introduced.
- No contract. Rejected because route and state behavior are externally visible
  to users and need testable acceptance.
