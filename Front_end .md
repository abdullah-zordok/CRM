# Phase 000 — Marketing Website & Product Shell

## Spec Name

```text
000-marketing-website-and-product-shell
```

---

# Purpose

Build the public-facing marketing website and the initial SaaS application shell for the Sales Operations Platform.

This phase establishes:

- Brand identity
- Marketing presence
- Routing architecture
- Authentication entry points
- Dashboard shell
- Navigation foundation
- Design system foundation

This phase MUST be completed before any CRM business functionality is implemented.

---

# Business Goal

Target Audience:

- Exhibition companies
- Sales managers
- Companies managing field sales representatives
- Organizations tracking leads and sales performance

Primary Conversion Goal:

```text
Contact Sales
```

The website should communicate:

- Accountability
- Visibility
- Lead Tracking
- Revenue Intelligence
- Performance Analytics

---

# Design Direction

Design Inspiration:

- Notion
- Odoo

Design Principles:

- Clean
- Professional
- Enterprise-focused
- Minimal
- Fast
- Modern
- High readability

---

# Scope

This phase focuses ONLY on:

- UI foundation
- Layout system
- Navigation system
- Routing architecture
- Marketing website
- Dashboard shell

This phase MUST NOT include:

- CRM business logic
- Lead management
- Deals management
- Analytics implementation
- Notifications implementation
- AI functionality

---

# Marketing Website Pages

## Landing Page

Route:

```text
/
```

Sections:

- Hero
- Problem Statement
- Solution Overview
- Features Overview
- Lead Lifecycle Flow
- Dashboard Preview
- Contact Sales CTA

---

## Features Page

Route:

```text
/features
```

Sections:

- Lead Tracking
- Activities Timeline
- Exhibitions
- Deals & Revenue
- Targets & Commissions
- Analytics
- Notifications

---

## About Page

Route:

```text
/about
```

Sections:

- Product Vision
- Mission
- Platform Philosophy

---

## Contact Page

Route:

```text
/contact
```

Primary CTA:

```text
Contact Sales
```

Form Fields:

- Name
- Company
- Email
- Phone
- Message

No backend submission required yet.

---

# Authentication Pages

## Login

```text
/login
```

---

## Register

```text
/register
```

---

## Forgot Password

```text
/forgot-password
```

---

## Reset Password

```text
/reset-password
```

---

# SaaS Application Shell

## Main Entry

```text
/app
```

---

## Dashboard

```text
/app/dashboard
```

---

# Future Route Placeholders

The following routes MUST exist as placeholders:

```text
/ app/leads
/ app/activities
/ app/exhibitions
/ app/deals
/ app/targets
/ app/analytics
/ app/notifications
/ app/team
/ app/settings
```

Each route should contain:

- page structure
- placeholder content
- layout integration

No business logic.

---

# Navigation System

## Sidebar

Items:

```text
Dashboard
Leads
Activities
Exhibitions
Deals
Targets
Analytics
Notifications
Team
Settings
```

---

## Top Navigation

Include:

- User menu placeholder
- Company switcher placeholder
- Notifications placeholder

---

# Routing Requirements

This phase MUST establish the complete routing architecture for future phases.

Requirements:

- App Router
- Route groups
- Nested layouts
- Protected route structure
- Public route structure

Future phases should plug into existing routes without restructuring navigation.

---

# Responsive Requirements

Support:

- Desktop
- Tablet
- Mobile

Navigation must adapt responsively.

---

# Technical Requirements

Frontend Stack:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- React Query

---

# Folder Structure

```text
src/
 ├── app/
 ├── components/
 ├── features/
 ├── layouts/
 ├── hooks/
 ├── lib/
 ├── constants/
 ├── types/
 └── providers/
```

---

# Acceptance Criteria

The phase is complete when:

- Marketing website is fully navigable
- All public pages exist
- Authentication pages exist
- Dashboard shell exists
- Sidebar navigation works
- Routing architecture is complete
- Future routes exist as placeholders
- Responsive layouts are implemented
- Shared design system foundation is established

---

# Spec Kit Workflow

Create Specification:

```text
$speckit-specify
```

Create Plan:

```text
$speckit-plan
```

Create Tasks:

```text
$speckit-tasks
```

Implementation:

```text
$speckit-implement
```

Implementation must follow:

- task-by-task execution
- continuous testing
- no unrelated file modifications
- reusable architecture patterns

```

```
