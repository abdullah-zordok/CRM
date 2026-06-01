# Data Model: CRM Front End

This feature introduces UI-facing models and form state only. It does not add new
database tables, migrations, persisted contact records, CRM aggregates, or domain
events.

## Visitor

Represents an unauthenticated person viewing the public product website.

**Attributes**:

- `sessionState`: anonymous
- `currentPublicPage`: landing, features, about, contact, login, register,
  forgot-password, or reset-password

**Validation rules**:

- Visitor may access public and authentication entry pages.
- Visitor must not access protected workspace content.

## Authenticated User

Represents a signed-in platform user who can enter the protected workspace shell.

**Attributes**:

- `sessionState`: authenticated
- `roleCategory`: Admin, Manager, or Sales Representative when available from
  existing foundation/session behavior
- `currentWorkspaceDestination`: dashboard or module destination

**Relationships**:

- Uses the existing foundation auth/session behavior.
- May see the same workspace shell in this feature unless later module specs
  narrow access.

**Validation rules**:

- Invalid or expired sessions redirect away from protected workspace content.
- No additional role-specific business permissions are introduced by this
  feature.

## Public Product Page

Represents a public page used to explain product value.

**Attributes**:

- `slug`: `/`, `/features`, `/about`, or `/contact`
- `purpose`: product overview, feature categories, vision, or contact sales
- `primaryAction`: contact sales or sign in where appropriate

**Relationships**:

- Linked from public navigation.
- Must not depend on protected user state.

**Validation rules**:

- Product audience, value proposition, and navigation must be understandable
  without sign-in.
- Public pages must not expose protected CRM data.

## Contact Sales Inquiry

Represents temporary form input on the public contact page.

**Attributes**:

- `name`: required text
- `company`: required text
- `email`: required email-like text
- `phone`: optional or required display field as defined by UI copy, validated
  as contact text when provided
- `message`: required text
- `submissionState`: idle, invalid, confirmed

**Relationships**:

- Belongs only to the contact page state.
- Does not create a Lead, notification, audit entry, or persisted sales record in
  this feature.

**Validation rules**:

- Required fields must be present before confirmation.
- Email must be malformed-input safe and user-friendly validation must be shown.
- Confirmation must be non-persistent and must not imply sales team routing.

## Workspace Shell

Represents the protected application frame.

**Attributes**:

- `navigationMode`: desktop, tablet, or mobile
- `userMenuState`: placeholder or existing session action state
- `companySwitcherState`: placeholder unavailable state
- `notificationsState`: placeholder unavailable state
- `activeDestination`: one protected workspace destination

**Relationships**:

- Wraps existing working protected module pages and new placeholder pages.
- Uses the existing sign-out control where available.

**Validation rules**:

- Must be unavailable to anonymous visitors.
- Must keep navigation usable across desktop, tablet, and mobile-sized screens.
- Must keep structure suitable for future right-to-left presentation.
- Must meet WCAG 2.2 AA expectations for core shell flows.

## Workspace Destination

Represents a protected destination reachable from the workspace navigation.

**Attributes**:

- `label`: dashboard, leads, activities, exhibitions, deals, targets, analytics,
  notifications, team, or settings
- `route`: protected route path
- `state`: working, placeholder, restricted, or unavailable
- `preservationRule`: preserve existing working behavior when present

**Relationships**:

- Belongs to the workspace shell navigation.
- May map to an existing module page or a placeholder module page.

**Validation rules**:

- 100% of planned destinations must be reachable from workspace navigation.
- Placeholder destinations must not expose live CRM data or unfinished business
  actions.
- Existing working pages must not be replaced by placeholders.

## Placeholder Module Page

Represents a future CRM module destination without implemented business
operations.

**Attributes**:

- `moduleName`: activities, exhibitions, deals, targets, analytics,
  notifications, settings, or another missing destination
- `readinessMessage`: concise unavailable or coming-soon state
- `actions`: no live business actions

**Relationships**:

- Is a type of workspace destination.
- May later be replaced by a module-specific feature.

**Validation rules**:

- Must identify the module.
- Must communicate that live operations are not available in this feature.
- Must not create, update, delete, or display sensitive CRM records.

## Account Lifecycle Placeholder

Represents register, forgot-password, and reset-password entry-only screens.

**Attributes**:

- `screen`: register, forgot-password, or reset-password
- `state`: unavailable
- `message`: clear account lifecycle unavailable state

**Relationships**:

- Linked from authentication entry areas where appropriate.
- Does not create users, tokens, password reset requests, or audit records in
  this feature.

**Validation rules**:

- Must not alter accounts or sessions.
- Must guide users back to sign-in or contact appropriate administrators.
