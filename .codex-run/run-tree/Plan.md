# CRM SaaS Platform — Spec-Driven Development Master Plan

## Overview

This project is a production-grade CRM and Sales Operations Platform built using:

- Next.js
- NestJS
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- shadcn/ui
- Redis
- BullMQ
- Docker
- GitHub Actions
- Spec Kit
- Codex CLI

The system is designed around:

- CRM-Based Architecture
- Internal Event-Driven Design
- Enterprise Scalability
- Modular Monolith Backend
- Spec-Driven Development (SDD)

---

# Core Product Vision

The platform solves three major business problems:

## 1. Operational Tracking

Track sales representatives, activities, exhibitions, and field performance.

## 2. CRM Management

Manage leads, follow-ups, pipelines, and customer relationships.

## 3. Revenue Intelligence

Track revenue, targets, commissions, forecasting, and performance analytics.

---

# Product Philosophy

This is NOT just a CRM.

This is a:

# Sales Operations Platform

The real value is:

- Accountability
- Visibility
- Revenue Tracking
- Performance Intelligence
- Operational Analytics

---

# Recommended Architecture

## Frontend

- Next.js
- App Router
- React Query
- Tailwind CSS
- shadcn/ui

---

## Backend

- NestJS
- Fastify
- Prisma ORM
- JWT Authentication
- Event-Driven Internal Architecture

---

## Database

- PostgreSQL

---

## Infrastructure

- Docker
- Redis
- BullMQ
- GitHub Actions
- CI/CD

---

# Architectural Decisions

## CRM-Based Architecture

The Lead is the center of the system.

Everything revolves around:

- Lead
- Activities
- Follow-ups
- Deals
- Revenue

---

## Internal Event-Driven Architecture

The backend should internally use domain events.

Examples:

```text
LeadCreated
LeadAssigned
FollowUpCreated
DealWon
TargetAchieved
```

This enables:

- Notifications
- Analytics
- AI Features
- Automation
- Integrations
- Queues

without tightly coupling the system.

---

# Lead Lifecycle

```text
Exhibition/Event
        ↓
Lead Created
        ↓
Assigned To Rep
        ↓
Follow-ups
        ↓
Negotiation
        ↓
Deal Closed
        ↓
Revenue + Commission
```

---

# Development Methodology

This project uses:

# Spec-Driven Development

Workflow:

```text
Constitution
    ↓
Specification
    ↓
Plan
    ↓
Tasks
    ↓
Implementation
    ↓
Review
    ↓
Next Capability
```

---

# Spec Kit Workflow

## Initialize Spec Kit

```bash
specify init --here --integration codex
```

---

## Constitution

```text
$speckit-constitution
```

The constitution defines:

- architecture principles
- coding standards
- testing requirements
- API conventions
- RBAC strategy
- event-driven rules
- performance standards

---

## Create Specification

```text
$speckit-specify
```

---

## Generate Plan

```text
$speckit-plan
```

---

## Generate Tasks

```text
$speckit-tasks
```

---

## Implementation Strategy

DO NOT implement entire phases at once.

Always:

- implement task-by-task
- review after each task
- run tests continuously
- avoid unrelated modifications

---

# Backend Folder Structure

```text
src/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── leads/
 │    ├── activities/
 │    ├── deals/
 │    ├── targets/
 │    ├── exhibitions/
 │    ├── analytics/
 │    └── notifications/
 │
 ├── common/
 │    ├── decorators/
 │    ├── guards/
 │    ├── interceptors/
 │    ├── filters/
 │    └── utils/
 │
 ├── infrastructure/
 │    ├── database/
 │    ├── queues/
 │    ├── cache/
 │    └── events/
 │
 ├── config/
 └── main.ts
```

---

# CRM Modules

## Users & Roles

Roles:

- Admin
- Manager
- Sales Representative

RBAC is required from day one.

---

## Leads Module

Lead fields:

```text
name
phone
email
company
source
status
assigned_to
event_id
created_by
priority
budget
notes
```

---

## Activities Timeline

Activities include:

- Calls
- WhatsApp logs
- Meetings
- Notes
- Visits
- Status changes
- Deal updates

Activities should behave as immutable logs.

---

## Deals & Revenue

Deals include:

```text
lead_id
amount
status
close_date
probability
sales_rep
```

---

## Targets & Commissions

Each sales rep should support:

```text
monthly_target
achieved_amount
achievement_percentage
bonus
commission
```

---

# Executive Dashboard

The executive dashboard should include:

- Monthly revenue
- New leads
- Conversion rate
- Top performers
- Lowest performers
- Best exhibitions
- Lost deals
- Pending follow-ups
- Pipeline value
- Revenue trends

---

# Future Features

## QR Lead Capture

Sales reps scan QR codes to:

- instantly create leads
- associate exhibitions
- assign sales reps

---

## WhatsApp Integration

Planned integrations:

- WhatsApp Cloud API
- Message templates
- Automated follow-ups
- Conversation tracking

---

## AI Features

Future AI capabilities:

- Lead scoring
- Sales forecasting
- Target prediction
- Smart recommendations
- Best follow-up timing

---

# Recommended Development Phases

---

# Phase 0 — Foundation Architecture

## Spec Name

```text
001-foundation-architecture
```

## Goals

- Setup Next.js frontend
- Setup NestJS backend
- Configure PostgreSQL
- Configure Prisma
- Setup authentication foundation
- Setup Docker
- Setup CI/CD
- Setup API standards
- Setup event system
- Setup queues
- Setup testing infrastructure

---

# Phase 1 — Users & RBAC

## Spec Name

```text
002-rbac-and-users
```

## Goals

- Users management
- Roles system
- Permissions system
- Team hierarchy
- Manager restrictions
- Sales rep restrictions
- Audit logs

---

# Phase 2 — Leads Core

## Spec Name

```text
003-leads-core
```

## Goals

- Lead creation
- Lead assignment
- Lead statuses
- Pipeline setup
- Source tracking
- Exhibition relations
- Notes system

---

# Phase 3 — Activities Timeline

## Spec Name

```text
004-activities-timeline
```

## Goals

- Calls logging
- Meetings
- WhatsApp logs
- Notes
- Visits
- Follow-up history
- Immutable timeline

---

# Phase 4 — Exhibitions Module

## Spec Name

```text
005-exhibitions-module
```

## Goals

- Exhibition management
- Rep attendance
- Lead attribution
- Exhibition analytics
- Performance tracking

---

# Phase 5 — Deals & Revenue

## Spec Name

```text
006-deals-and-revenue
```

## Goals

- Deals management
- Revenue tracking
- Win/loss tracking
- Conversion metrics
- Deal stages
- Revenue analytics foundation

---

# Phase 6 — Targets & Commissions

## Spec Name

```text
007-targets-and-commissions
```

## Goals

- Monthly targets
- Achievement tracking
- Commission engine
- Bonus calculations
- Leaderboards

---

# Phase 7 — Executive Analytics

## Spec Name

```text
008-executive-analytics
```

## Goals

- KPI dashboards
- Revenue analytics
- Conversion tracking
- Sales trends
- Exhibition ROI
- Pipeline analytics

---

# Phase 8 — Notifications Engine

## Spec Name

```text
009-notifications-engine
```

## Goals

- Smart reminders
- Delayed follow-up alerts
- Deal warnings
- Target warnings
- Notification center

---

# Phase 9 — WhatsApp Integration

## Spec Name

```text
010-whatsapp-integration
```

## Goals

- WhatsApp Cloud API
- Conversation tracking
- Automated messaging
- Follow-up messaging

---

# Phase 10 — AI Insights

## Spec Name

```text
011-ai-insights
```

## Goals

- Lead scoring
- Forecasting
- Target prediction
- Smart recommendations
- AI-powered analytics

---

# Recommended Specs Structure

```text
/specs
 ├── 001-foundation-architecture
 ├── 002-rbac-and-users
 ├── 003-leads-core
 ├── 004-activities-timeline
 ├── 005-exhibitions-module
 ├── 006-deals-and-revenue
 ├── 007-targets-and-commissions
 ├── 008-executive-analytics
 ├── 009-notifications-engine
 ├── 010-whatsapp-integration
 └── 011-ai-insights
```

---

# Final Notes

## Most Important Principle

One Spec = One Business Capability

NOT:

- one page
- one component
- one endpoint

Specs should describe:

- business workflows
- business intent
- operational capabilities

---

# Initial Focus

Focus first on:

- accountability
- lead tracking
- follow-ups
- target tracking
- operational visibility

Do NOT start with:

- AI
- forecasting
- complex automation
- mobile apps

Build the operational core first.

---

# Product Positioning

This project should be positioned as:

# Sales Operations Platform

NOT just a CRM.

