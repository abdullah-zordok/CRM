# UI Contract: User and Lead Recovery

## Protected User Management

### Create User Form

Required controls:
- Email input.
- Display name input.
- Password input with validation feedback.
- Role selection for Admin, Manager, and Sales Representative.
- Team selection when role/team assignment is available.
- Submit and cancel actions.

Expected behavior:
- Successful creation shows the user as active and login-ready.
- Password values are never shown after submission.
- Duplicate email, weak password, missing role, and denied Admin access produce clear validation or permission states.
- No activation link, activation email, or registration prompt is shown for this workflow.

### User List and Detail

Required controls and states:
- Search and role/status filters when already available.
- Edit, disable, and delete actions for users the Admin can manage.
- Delete confirmation dialog with Cancel and Delete User actions.
- Blocked state for self-deletion and last-active-admin removal.
- Deleted users excluded from normal active lists unless a historical/deleted-user view is intentionally selected.

Expected behavior:
- Deleting a user removes active access but does not remove historical owner/creator labels from leads.
- Disabled or deleted users cannot sign in.

## Login

Required controls:
- Email input.
- Password input.
- Submit action.

Expected behavior:
- Active non-deleted users can sign in.
- Invalid credentials, disabled accounts, and deleted accounts show safe denial messages.
- Denial messages do not reveal whether the email exists, whether the account was deleted, or credential details.

## Lead Creation

Required controls:
- Name.
- Email and/or phone according to existing lead validation.
- Company.
- Source.
- Status.
- Priority.
- Optional owner selector only for roles allowed to assign owners.

Expected behavior:
- Sales Representatives can create leads without selecting another owner.
- The created lead shows Owned By and Created By as the current Sales Representative.
- The "Eligible lead owner not found" message is not shown for valid Sales Representative creation.
- Missing required lead details, duplicates, denied scope, and stale state show existing safe feedback patterns.

## Lead Visibility

Expected behavior:
- Sales Representatives see owned leads only.
- Managers see team leads and related activities/follow-ups only.
- Admins see all leads and related activities/follow-ups.
- Restricted details are not shown in denied or not-found states.
- Lead detail shows Created By, Owned By, Created At, and Last Updated to authorized users.

## Dashboard Metrics

Required sections:
- Total leads.
- Leads per representative.
- Leads per team.
- Leads by source.
- Representative rows with name, email, role, lead count, activity count, follow-up count, and last activity.

Expected behavior:
- Admin dashboard uses global scope.
- Manager dashboard uses team scope.
- Empty states show zero totals and no representative rows when no scoped records exist.
- Sales Representatives do not see management metrics unless separately permitted.

## Accessibility and Responsive Requirements

- Forms, dialogs, dashboard summaries, and lead lists must be keyboard usable.
- Delete confirmation must trap focus while open and restore focus after close.
- Validation and denial messages must be associated with the relevant controls or regions.
- Layouts must remain usable on desktop and mobile widths without overlapping text or controls.
