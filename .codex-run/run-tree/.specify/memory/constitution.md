<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Capability-Centered CRM Architecture
- Template principle 2 -> II. Secure-by-Default Access Control
- Template principle 3 -> III. Test-First Quality Gates
- Template principle 4 -> IV. Auditable Event-Driven Operations
- Template principle 5 -> V. Observable, Scalable, Maintainable Delivery
Added sections:
- Technology and Security Standards
- Spec-Driven Delivery Workflow
Removed sections:
- Placeholder Section 2
- Placeholder Section 3
Templates requiring updates:
- UPDATED .specify/templates/plan-template.md
- UPDATED .specify/templates/spec-template.md
- UPDATED .specify/templates/tasks-template.md
- REVIEWED .specify/templates/commands/*.md (no command templates present)
- REVIEWED AGENTS.md (no update required)
- REVIEWED Plan.md (no update required)
Follow-up TODOs: none
-->
# Sales Operations CRM Platform Constitution

## Core Principles

### I. Capability-Centered CRM Architecture
Every feature MUST map to one independently valuable business capability, not a
page, component, or endpoint. The Lead remains the central domain aggregate for
sales operations; related features MUST preserve clear relationships among leads,
activities, follow-ups, deals, revenue, targets, exhibitions, analytics, and
notifications. Backend modules MUST follow a modular monolith structure with
explicit module boundaries, typed service contracts, and Prisma-backed persistence.

Rationale: The platform exists to deliver accountability, visibility, revenue
tracking, and operational analytics. Capability boundaries keep the CRM model
coherent as features expand.

### II. Secure-by-Default Access Control
Authentication, authorization, validation, and auditability MUST be designed
before implementation. RBAC MUST exist from day one with Admin, Manager, and
Sales Representative roles, and every protected action MUST verify permissions at
the API boundary. Sensitive CRM data, including customer contact details, revenue,
commissions, notes, and integration credentials, MUST be protected with least
privilege access, server-side validation, safe error responses, encrypted secrets,
and secure session or token handling.

Rationale: CRM systems contain customer, sales, and financial data. A feature
that bypasses RBAC, audit logging, or validation creates unacceptable business
and security risk.

### III. Test-First Quality Gates
Tests MUST be planned before implementation for every feature. Contract tests are
required for public APIs, integration tests are required for business workflows,
and unit tests are required for domain logic, permission checks, validation, and
calculation rules. Security-relevant behavior, including RBAC denial paths,
tenant or team scoping, input validation, audit logging, and token handling, MUST
have automated coverage before a feature is considered complete.

Rationale: CRM correctness depends on workflow integrity and access control.
Tests provide the evidence needed to safely deliver incremental capabilities.

### IV. Auditable Event-Driven Operations
Business state changes MUST emit explicit domain events when they can affect
notifications, analytics, automation, integrations, queues, or audit trails.
Events such as LeadCreated, LeadAssigned, FollowUpCreated, DealWon, and
TargetAchieved MUST have stable names, typed payloads, idempotent handlers where
retries are possible, and traceable correlation identifiers. Activities and audit
logs MUST be append-only unless a documented compliance process requires
redaction.

Rationale: Internal events decouple operational workflows while preserving the
history required for analytics, accountability, and future automation.

### V. Observable, Scalable, Maintainable Delivery
Features MUST include structured logging, error handling, performance targets,
and operational metrics appropriate to their risk. Long-running or retryable work
MUST use Redis-backed queues through BullMQ. Database changes MUST use reviewed
Prisma migrations, indexes for expected query paths, and transaction boundaries
for multi-step business operations. Frontend work MUST use accessible,
responsive, role-aware interfaces with predictable states for loading, empty,
error, and permission-denied conditions.

Rationale: The platform must support repeated operational use, analytics, and
growth without sacrificing reliability or maintainability.

## Technology and Security Standards

The approved baseline stack is Next.js with App Router, React Query, Tailwind CSS,
and shadcn/ui for the frontend; NestJS with Fastify, Prisma ORM, JWT-based
authentication, and internal domain events for the backend; PostgreSQL for primary
storage; Redis and BullMQ for queues; Docker for local and deployment packaging;
and GitHub Actions for CI/CD.

All implementation plans MUST document:
- RBAC roles, permissions, ownership or team scoping, and denial behavior.
- Data classification for customer, revenue, commission, note, and credential
  fields touched by the feature.
- Validation and sanitization rules at API and form boundaries.
- Audit log entries and immutable activity timeline behavior.
- Domain events, queue jobs, retries, and idempotency requirements.
- Database migrations, indexes, transaction boundaries, and retention needs.
- Observability signals: logs, metrics, alerts, and trace correlation.
- Performance targets for critical list, dashboard, import, and reporting flows.

Secrets MUST NOT be committed. Production configuration MUST be supplied through
environment variables or a managed secret store. Integrations such as WhatsApp or
AI services MUST isolate credentials, verify webhook authenticity where
applicable, and avoid storing unnecessary third-party payloads.

## Spec-Driven Delivery Workflow

The project follows Spec Kit in this order: constitution, specification, plan,
tasks, implementation, review, and next capability. Each spec MUST represent one
business capability and MUST be independently testable. Implementation MUST happen
task by task, with tests and security checks run continuously.

The operational core has priority over advanced automation. Initial work MUST
focus on accountability, lead tracking, follow-ups, target tracking, RBAC, audit
logs, and operational visibility before AI, forecasting, complex automation, or
mobile-specific features.

No feature may be accepted unless its spec, plan, tasks, implementation, and
tests demonstrate compliance with this constitution. Exceptions require a written
Complexity Tracking entry in the implementation plan with the rejected simpler
alternative and a mitigation plan.

## Governance

This constitution supersedes conflicting project guidance. Amendments require a
documented rationale, a semantic version change, and updates to affected Spec Kit
templates or runtime guidance. Major version changes remove or redefine existing
principles, minor version changes add principles or materially expand governance,
and patch version changes clarify wording without changing obligations.

Every specification, plan, task list, and code review MUST check compliance with
the core principles. Reviewers MUST reject work that lacks required RBAC,
validation, auditability, event contracts, observability, migrations, or tests for
the affected capability. Any approved exception MUST be time-bound and recorded in
the feature plan.

**Version**: 1.0.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-05-28
