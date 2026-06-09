# Research: User and Lead Recovery

## Decision: Treat the feature as a recovery across existing modules

**Rationale**: The broken workflows sit at the join between Users/RBAC, Auth, Leads Core, Activities, and dashboard reporting. Updating those existing boundaries preserves the CRM capability model and avoids a duplicate "recovery" module that would own no durable business aggregate.

**Alternatives considered**:
- Create a new recovery module: rejected because it would couple unrelated write paths behind a temporary concept.
- Rebuild Users/RBAC and Leads Core from scratch: rejected because existing plans and code already define the proper module boundaries.

## Decision: Admin-created users become active immediately with stored credential hashes

**Rationale**: The current business requirement explicitly removes email invitations, activation pages, and registration workflows for this stage. Immediate active status is the shortest reliable path to making created users operational while preserving secure credential storage.

**Alternatives considered**:
- Keep pending activation and add email invitations: rejected because email delivery and activation links are out of scope.
- Allow users to self-register: rejected because Admin-controlled user management is required.
- Use temporary passwords without permanent credential storage: rejected because users need stable sign-in credentials.

## Decision: Keep activation infrastructure dormant rather than deleting it blindly

**Rationale**: Prior Users/RBAC work may already contain activation records and UI. The recovery feature should bypass activation for new Admin-created users while preserving existing records and routes unless tasks later prove they are unused. This reduces migration risk and keeps future invitation workflows possible.

**Alternatives considered**:
- Delete all activation concepts now: rejected because it could break existing tests, historical records, or future onboarding.
- Require activation completion for all users: rejected because it keeps the current workflow blocked.

## Decision: Use soft deletion for users

**Rationale**: User deletion must remove active access while preserving historical lead ownership, creator attribution, activities, notes, follow-ups, reports, and audits. Soft deletion keeps references intact and avoids broken accountability.

**Alternatives considered**:
- Hard delete users: rejected because historical leads and audit trails would lose accountable owners and creators.
- Only disable users with no delete action: rejected because the Admin lifecycle requirement explicitly includes deletion.

## Decision: Block self-deletion and last-active-admin removal inside the same transaction as lifecycle change

**Rationale**: These safety rules protect system recoverability. The check and state change must be atomic so two concurrent Admin actions cannot leave the CRM without an active Admin.

**Alternatives considered**:
- Check only in the UI: rejected because API callers could bypass it.
- Check before the transaction only: rejected because concurrent changes could invalidate the count.

## Decision: Sales Representative lead creation assigns owner and creator to the current user

**Rationale**: The current "Eligible lead owner not found" failure comes from searching for another owner during creation. For representative-created leads, the signed-in representative is the natural owner and creator, and this matches the accountability requirement.

**Alternatives considered**:
- Require representatives to select an owner: rejected because it slows the primary workflow and can cause invalid assignments.
- Continue automatic search for an eligible owner: rejected because it is the current failure mode.
- Assign leads to a Manager by default: rejected because it breaks representative accountability.

## Decision: Keep existing Admin and Manager assignment capabilities separate from representative self-owned creation

**Rationale**: Leads Core may already support Admin/Manager assignment and reassignment. This recovery narrows the broken create path for Sales Representatives while preserving broader assignment controls for authorized users.

**Alternatives considered**:
- Remove owner selection everywhere: rejected because Admin and Manager assignment workflows remain useful.
- Let representatives assign to any user: rejected because it bypasses role and ownership controls.

## Decision: Enforce role, ownership, and team scope at API boundaries and mirror it in UI states

**Rationale**: Protected CRM data cannot rely on frontend filtering. API enforcement protects direct calls, while UI-scoped controls reduce user confusion and expose clear denied/empty states.

**Alternatives considered**:
- UI-only filtering: rejected because it leaks data through API access.
- Global lead visibility for every authenticated user: rejected because it violates least privilege.

## Decision: Add operational dashboard metrics as scoped summaries, not analytics

**Rationale**: The required metrics are accountability summaries for Admins and Managers: total leads, leads by representative, leads by team, leads by source, activity count, follow-up count, and last activity. They should not become forecasting, executive analytics, revenue ROI, or advanced reporting.

**Alternatives considered**:
- Defer all metrics: rejected because Admin and Manager accountability is part of the recovery goal.
- Build a full analytics module: rejected because advanced analytics is explicitly out of scope.

## Decision: Emit audit records and lightweight domain events for recovery workflows

**Rationale**: Credential setup, login outcomes, user lifecycle changes, lead creation, owner assignment, visibility denial, and dashboard metric access affect security and accountability. Stable events with sanitized payloads support future analytics and notifications without adding queue jobs now.

**Alternatives considered**:
- Audit only user changes: rejected because lead ownership and visibility denials are also accountability-critical.
- Add notification jobs: rejected because notifications are a later phase.
