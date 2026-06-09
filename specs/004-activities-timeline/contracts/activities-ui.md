# UI Contract: Activities Timeline

## Protected Routes

### `/activities`

Purpose: Cross-lead activity and follow-up workspace for permitted users.

Required states:

- Loading activity list.
- Empty result with active filters visible.
- Activity list with lead, owner, type, status, due date/activity time, and outcome preview.
- Filter panel for owner, team scope, lead, activity type, status, due state, and date range.
- Overdue and due-today indicators.
- Denied state when the user is authenticated but lacks activity workspace access.
- Safe error state for unavailable activity data.

Primary actions:

- Filter visible activities.
- Navigate to related lead when permitted.
- Complete an open follow-up.
- Reassign an open follow-up to an eligible owner.
- Cancel an open planned activity.

Accessibility expectations:

- Filters and row actions are keyboard reachable.
- Status and due-state indicators have text labels, not color alone.
- Focus remains in context after completing, reassigning, or canceling an activity.

### `/leads/{leadId}`

Purpose: Lead detail page includes activity timeline section for the current lead.

Required states:

- Lead activity timeline loading, empty, and error states.
- Completed activity items in chronological context.
- Open follow-up items separated or clearly labelled from completed history.
- Create completed activity form.
- Schedule follow-up form.
- Safe denied state when the lead is not visible.

Primary actions:

- Add completed activity.
- Schedule follow-up.
- Complete open follow-up.
- Reassign open follow-up.
- Cancel open follow-up.

Accessibility expectations:

- Timeline items expose type, status, owner, time/due date, and outcome to assistive technology.
- Forms announce validation errors near the relevant fields.
- Keyboard-only users can create, schedule, complete, and cancel without focus loss.

## Navigation Contract

- Workspace navigation item `Activities` changes from placeholder to working destination.
- Activity list links preserve enough return context to go back to the current filter state.
- Lead detail pages expose a visible activity/timeline section without hiding existing lead core
  controls.

## Copy and Safety Contract

- Empty state: "No activities match the current filters."
- Denied state: "You do not have access to these activities."
- Archived lead restriction: "New follow-ups cannot be scheduled for archived leads."
- Stale update: "This activity changed since you opened it. Refresh and try again."
- Sensitive note guidance: "Do not include passwords, payment details, or private credentials in
  activity notes."
