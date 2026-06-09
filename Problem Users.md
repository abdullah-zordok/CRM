# CRM SaaS Platform

# User Authentication & Lead Ownership Recovery Plan

## Current Situation

The platform currently supports:

- Admin login
- User creation from the dashboard
- RBAC roles (Admin, Manager, Sales Representative)
- Lead management UI
- Protected workspace

However, there are two critical business workflow issues preventing the CRM from functioning as a real Sales Operations Platform.

---

# Problem 1: Created Users Cannot Access The System

## Current Behavior

Admin can create a user.

Example:

- Email: [ali@example.com](mailto:ali@example.com)
- Role: Sales Representative

The user is stored successfully.

However:

- No password is assigned.
- No activation flow exists.
- User cannot log in.
- User cannot access CRM functionality.

As a result, created users are unusable.

---

## Business Impact

The entire Sales Representative workflow is blocked.

Sales reps cannot:

- Log in
- Create leads
- Manage leads
- Add notes
- Add follow-ups

The CRM becomes admin-only.

---

# Problem 2: Lead Creation Is Not Working

## Current Behavior

The Lead Creation page displays:

"Eligible lead owner not found"

Lead records are not created successfully.

Lead ownership assignment is failing.

---

## Business Impact

The core CRM workflow is broken.

The platform cannot:

- Capture leads
- Assign ownership
- Track sales performance
- Measure team productivity

Without lead creation, the CRM provides no operational value.

---

# Goal

Implement a minimal but production-ready operational workflow.

The system must support:

1. Admin creates users.
2. Users can log in.
3. Sales reps can create leads.
4. Lead ownership is tracked.
5. Admin can see which rep created each lead.
6. Managers can monitor team performance.

---

# PHASE 1

# User Authentication Completion

## Objective

Allow users created by Admin to access the platform using permanent credentials.

---

## Required UI Changes

### User Creation Form

Current:

- Email
- Display Name
- Role

Required:

- Email
- Display Name
- Password
- Role

---

## Backend Changes

### CreateUserDto

Add:

```ts
password: string;
```

### User Creation Service

Hash passwords before storing.

Use bcrypt.

Example:

```ts
const passwordHash = await bcrypt.hash(dto.password, 10);
```

Store:

```ts
passwordHash;
```

Never store raw passwords.

---

## Database Requirements

Users table should contain:

```ts
id;
email;
displayName;
passwordHash;
status;
createdAt;
updatedAt;
```

---

## Login Requirements

Authentication flow:

```text
User enters email
↓
User enters password
↓
Validate passwordHash
↓
Issue JWT
↓
Grant access
```

---

## RBAC Rules

### Admin

Can:

- Manage users
- View all leads
- View all activities
- View all reports

---

### Manager

Can:

- View team leads
- View team activities
- Monitor performance

---

### Sales Representative

Can:

- Create leads
- View own leads
- Add notes
- Add follow-ups

Cannot:

- Manage users
- Access admin pages

---

## Success Criteria

A newly created Sales Representative can:

- Log in successfully
- Access dashboard
- Access lead management pages

---

# PHASE 2

# Lead Ownership & Visibility

## Objective

Create a complete operational lead flow.

---

## Current Failure

The API attempts to assign an owner automatically.

This results in:

```text
Eligible lead owner not found
```

Lead creation fails.

---

## Required Change

When a Sales Representative creates a lead:

Assign ownership automatically.

Example:

```ts
ownerId = currentUser.id;
createdById = currentUser.id;
```

Do not search for another owner.

The creator becomes the owner.

---

## Lead Model Requirements

Each lead must store:

```ts
id;
name;
email;
phone;
company;

ownerId;
createdById;

source;
status;
priority;

createdAt;
updatedAt;
```

---

## Lead Creation Flow

```text
Sales Rep Login
↓
Create Lead
↓
Lead Saved
↓
Owner = Current User
↓
CreatedBy = Current User
```

---

## Lead Visibility Rules

### Sales Representative

Can view:

- Own leads only

Query restriction:

```ts
where: {
  ownerId: currentUser.id;
}
```

---

### Manager

Can view:

- Leads owned by team members

---

### Admin

Can view:

- All leads

No restrictions.

---

## Dashboard Enhancements

Admin dashboard should display:

### Lead Metrics

- Total leads
- Leads per sales rep
- Leads per team
- Leads by source

### Rep Metrics

For each rep:

```text
Name
Email
Role

Lead Count
Activities Count
Follow-up Count
Last Activity
```

---

## Auditability

Every lead must clearly show:

```text
Created By
Owned By
Created At
Last Updated
```

This is mandatory for accountability and performance tracking.

---

# Expected Final Workflow

Admin
↓
Creates Sales Representative
↓
Sales Representative Logs In
↓
Creates Lead
↓
Lead Saved
↓
Ownership Assigned Automatically
↓
Admin Sees Lead Creator
↓
Manager Tracks Team Activity
↓
CRM Operational Workflow Complete

---

# PHASE 1.1

# User Activation & User Lifecycle Management

## Problem 3: Users Remain In PENDING_ACTIVATION

### Current Behavior

When an Admin creates a new user:

```text
Create User
↓
User Created
↓
Status = PENDING_ACTIVATION
```

The user cannot access the platform.

No activation workflow currently exists.

No email invitation system exists.

No activation page exists.

No admin activation action exists.

As a result, newly created users are unusable.

---

## Business Requirement

For the current CRM stage, the platform does not require:

- Email verification
- Invitation links
- Activation emails
- Registration workflows

The objective is operational simplicity.

---

## Required Solution

When an Admin creates a user:

```text
Create User
↓
Store Password Hash
↓
Status = ACTIVE
↓
User Can Login Immediately
```

Replace:

```ts
status: "PENDING_ACTIVATION";
```

With:

```ts
status: "ACTIVE";
```

during user creation.

---

## Login Flow

```text
Admin Creates User
↓
User Receives Credentials
↓
User Logs In
↓
Access Granted
```

No activation step required.

---

## Success Criteria

A newly created user can:

- Log in immediately
- Access permitted pages
- Create leads
- Perform assigned responsibilities

without requiring activation.

---

# Problem 4: Admin Cannot Delete Users

### Current Behavior

Admin can create users.

Admin cannot remove users.

User lifecycle management is incomplete.

---

## Business Requirement

Admin must be able to manage the entire user lifecycle.

Including:

- Create User
- Update User
- Disable User
- Delete User

---

## Required UI Changes

Add a Delete User button to each user card.

Example:

```text
[Edit]
[Deactivate]
[Delete]
```

---

## Delete Confirmation

Before deletion:

```text
Are you sure you want to delete this user?

This action cannot be undone.
```

Options:

```text
Cancel
Delete User
```

---

## Backend Requirements

Create endpoint:

```http
DELETE /users/:id
```

---

## Safety Rules

Prevent deletion of:

### Last Admin

The system must never allow:

```text
0 Admin Users
```

At least one Admin must remain active.

---

### Self Deletion

Admin cannot delete their own account while logged in.

---

## Recommended Approach

Instead of hard delete:

Use soft delete.

Example:

```ts
deletedAt: Date | null;
isDeleted: boolean;
```

When deleting:

```ts
isDeleted = true;
deletedAt = now();
```

Benefits:

- Audit trail preserved
- Historical lead ownership preserved
- Reporting remains accurate

---

## Lead Ownership Preservation

If a deleted Sales Representative owns leads:

Do NOT delete the leads.

Keep:

```text
Lead
Owner
CreatedBy
Activities
Notes
```

for historical reporting.

---

## Success Criteria

Admin can:

- Create users
- Edit users
- Delete users safely
- Prevent accidental removal of system administrators

The CRM now supports complete user lifecycle management.

# Important Constraints

Do NOT start:

- AI features
- Forecasting
- Recommendations
- WhatsApp automation
- Executive analytics

Until:

- User authentication works
- Lead creation works
- Lead ownership works
- Lead visibility works

These capabilities are the operational foundation of the CRM platform.
