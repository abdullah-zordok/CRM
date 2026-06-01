# Research: Foundation Architecture

## Decision: Use TypeScript on Node.js 24 LTS

**Rationale**: A single TypeScript baseline supports both the frontend and
backend while reducing duplicated validation, contract, and test patterns. Node
24 is the current LTS line for a 2026 greenfield foundation and gives a stable
runtime target for containers and CI.

**Alternatives considered**:
- Node 22 LTS: mature, but shorter remaining support window for a new platform.
- Node 26 current: newer, but not the conservative LTS baseline for production.

## Decision: Use a workspace with `apps/web`, `apps/api`, and shared packages

**Rationale**: Phase 0 must prove web shell, API shell, contracts, CI, and local
runtime together. A workspace keeps both apps versioned and verified together
while preserving the backend as a modular monolith.

**Alternatives considered**:
- Single `src/` project: insufficient for separate web and API foundations.
- Multiple repositories: unnecessary operational overhead before the CRM core
  exists.

## Decision: Use Next.js App Router for the protected web shell

**Rationale**: The master plan selects Next.js and App Router. The protected shell
needs routing, authenticated layout behavior, loading/error states, and a path for
role-aware navigation without implementing full CRM pages.

**Alternatives considered**:
- Static-only web shell: cannot validate authenticated navigation.
- Separate marketing-style frontend: misaligned with the operational CRM product.

## Decision: Use NestJS with Fastify for the API foundation

**Rationale**: The master plan selects NestJS, Fastify, JWT authentication, and a
modular monolith backend. Nest modules align with auth, users, foundation,
observability, queues, database, events, and future CRM business modules.

**Alternatives considered**:
- Minimal custom HTTP server: faster initially, but weaker module boundaries and
  test conventions.
- Microservices: unjustified before the operational core exists.

## Decision: Use PostgreSQL plus Prisma for minimal persisted foundation data

**Rationale**: PostgreSQL and Prisma are part of the approved stack. Phase 0 only
persists foundation identity, role categories, auth state, audit records, smoke
events, and smoke job metadata. This proves migrations and secure data handling
without creating CRM business records.

**Alternatives considered**:
- In-memory identity only: cannot validate migrations, audit persistence, or
  startup from a clean environment.
- Full user/profile schema: belongs to Phase 1 and would expand scope.

## Decision: Use secure cookie-based JWT session behavior for browser auth

**Rationale**: The project requires JWT authentication and secure token handling.
For the browser shell, short-lived JWT session state in an HttpOnly, Secure,
SameSite cookie reduces token exposure to client scripts while still supporting
server-side role checks and protected route validation.

**Alternatives considered**:
- Local storage bearer token: easier to inspect, but higher exposure if scripts
  are compromised.
- Full external identity provider: valuable later, but unnecessary for Phase 0
  foundation validation.

## Decision: Include baseline role categories, not full permission management

**Rationale**: The constitution requires RBAC from day one and the clarified spec
requires Admin, Manager, and Sales Representative categories. Phase 0 represents
these categories and proves baseline checks, while Phase 1 owns detailed
permissions, team hierarchy, and user administration.

**Alternatives considered**:
- No roles until Phase 1: conflicts with secure-by-default access control.
- Full role editor and permission matrix: out of scope for foundation.

## Decision: Use Redis-backed BullMQ for one smoke background job

**Rationale**: The approved stack includes Redis and BullMQ. A non-business smoke
job proves queue connectivity, retry policy, idempotency, and job status
visibility without implementing notifications, analytics, or CRM automation.

**Alternatives considered**:
- Contract-only queue design: leaves a high-risk integration unverified.
- Business notifications in Phase 0: belongs to later CRM phases.

## Decision: Use a non-business smoke event for event bus readiness

**Rationale**: The CRM roadmap depends on future events such as LeadCreated and
DealWon, but Phase 0 must not create CRM business workflows. A FoundationSmoke
event validates naming, payload shape, correlation, audit/log integration, and
job dispatch without business data.

**Alternatives considered**:
- No emitted event: weak validation of event-driven architecture.
- Lead or deal events: leaks later-phase scope into the foundation.

## Decision: Make OpenAPI the API contract artifact

**Rationale**: Phase 0 exposes web-service interfaces for health/readiness,
login/logout/session, and smoke job verification. OpenAPI is testable, readable,
and can drive contract tests before implementation.

**Alternatives considered**:
- Markdown-only endpoint notes: less enforceable in tests.
- GraphQL schema: unnecessary for the narrow foundation API.

## Decision: CI quality pipeline verifies build, tests, security checks,
migrations, and container startup

**Rationale**: The clarified spec requires automated quality verification for
every change. The pipeline validates the foundation as a deployable unit without
adding production release approvals or environment promotion.

**Alternatives considered**:
- Local-only verification: insufficient for repeatable team delivery.
- Full production pipeline: should be planned after the foundation baseline.

## Decision: Observability baseline includes structured logs, health/readiness,
audit events, job status, and request correlation

**Rationale**: This is enough to validate foundation auth, access denial, smoke
events, smoke jobs, and startup without building executive dashboards or a full
observability suite.

**Alternatives considered**:
- Console logs only: insufficient for auditability and troubleshooting.
- Full dashboards, alerts, distributed tracing, and business KPIs: belong to
  later analytics or hardening work.

## Decision: Use Docker Compose for local foundation verification

**Rationale**: Phase 0 needs reproducible local startup for web, API, PostgreSQL,
and Redis, plus a container startup check in CI. Docker Compose keeps the
foundation easy to run before production deployment design exists.

**Alternatives considered**:
- Host-installed services only: inconsistent developer setup.
- Kubernetes from day one: unnecessary complexity for Phase 0.

## References

- Node.js previous releases: https://nodejs.org/en/about/previous-releases
- Next.js installation docs: https://nextjs.org/docs/pages/getting-started/installation
- NestJS documentation: https://docs.nestjs.com/
- Prisma documentation: https://www.prisma.io/docs
- BullMQ documentation: https://docs.bullmq.io/
- Tailwind CSS documentation: https://tailwindcss.com/docs
