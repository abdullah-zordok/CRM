# UI Contract: Exhibitions Module

## Protected Routes

### `/exhibitions`

Purpose: Protected workspace for scoped exhibition search, creation entry, filter review, and
summary scanning.

Required states:

- Loading state while exhibition filters or results are unavailable.
- Empty state when no permitted exhibitions match filters.
- Permission-denied state when the current user lacks exhibition search access.
- Validation state for invalid filter values.
- Error state with safe retry guidance for unavailable data.

Required interactions:

- Filter by text, status, date range, location, owner, team, attendee, and attribution state.
- Create exhibition entry point for permitted Admin and Manager users.
- Keyboard-accessible list navigation to exhibition detail.
- Summary cards or list columns for status, date range, location, attendee count, attributed lead
  count, open follow-ups, and overdue follow-ups.

### `/exhibitions/[exhibitionId]`

Purpose: Protected exhibition detail for lifecycle, attendee, attribution, history, and performance
review.

Required states:

- Loading, empty, denied, stale update, validation, and unavailable states.
- Archived/canceled status state that prevents normal attendance and attribution edits.

Required sections:

- Event overview: name, status, date range, location, owner, team, and notes.
- Attendees: planned attendees, attendance status, confirmation actor/time, correction state.
- Attributed leads: visible lead name/company, owner, status, priority, attribution state, latest
  follow-up health.
- Performance summary: attributed lead count, status distribution, attendee participation, open
  follow-ups, overdue follow-ups, and recent activity indicators.
- History: sanitized exhibition lifecycle, attendance, attribution, stale update, and denied access
  entries visible to permitted users.

### `/leads/[leadId]`

Purpose: Existing lead detail augmented with full exhibition attribution context when present.

Required additions:

- Display full exhibition link/context when the lead is attributed to an exhibition.
- Preserve existing lightweight reference display when no full exhibition has been linked.
- Provide attribution action for permitted users without exposing restricted exhibitions.
- Preserve lead access denial behavior.

## Accessibility Requirements

- All create, edit, archive, restore, assign attendee, confirm attendance, attribute lead, filter,
  and navigation controls must be reachable by keyboard.
- Focus must remain predictable after form validation errors, stale update responses, and successful
  mutations.
- Status, attendance, attribution, and summary indicators must not rely on color alone.
- Forms must expose field labels, required state, and field-level errors to assistive technology.

## Copy And Safety Rules

- Denied states must not reveal whether a restricted exhibition, lead, attendee, or team exists.
- Empty summary states must distinguish "no permitted data" from "not yet attributed".
- Notes and history previews must avoid secrets, credentials, payment details, and hidden audit
  metadata.
- Revenue ROI, commission, target, notification, AI, import/export, and mobile workflow copy must
  remain out of Phase 4 primary flows.
