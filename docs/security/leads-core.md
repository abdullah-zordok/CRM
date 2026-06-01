# Leads Core Security

Lead records contain contact details, budget estimates, notes, and operational
history. Treat these fields as scoped CRM data and avoid logging raw payloads.

## Data Classification

- Contact data: customer names, companies, emails, phones, and source context are
  restricted to users with lead access.
- Commercial context: budget estimates, priority, and status are operational CRM
  data and must stay behind role and scope checks.
- Notes and history: append-only business context that can contain sensitive
  customer details; never expose notes through duplicate, search, or denied
  responses.
- Audit and event metadata: security and operational records that must preserve
  correlation while avoiding secrets, tokens, stack traces, and raw internals.

## Access Control

Protected actions are checked through role permissions and lead scope decisions:
Admin global scope, Manager team scope, Sales Representative owned scope, and
default deny for everything else. Denied decisions and sensitive changes are
audited with correlation identifiers.

Every protected API path must record or preserve a `LeadAccessDecision` for
create, view, update, assign, change status, add note, view history, and search.
Managers may only operate inside team scope. Sales Representatives may create and
work owned or explicitly visible leads, but they cannot assign leads to others in
Phase 2.

## Duplicate Privacy

Duplicate detection is platform-wide but privacy-safe. Users without access to a
matching lead receive a restricted duplicate message without owner, contact, or
lead detail disclosure.

Visible duplicates may return the visible lead id for navigation. Restricted
duplicates must not disclose owner, team, contact value, status, source, notes,
budget, or history details.

## Audit And Events

Lead notes and history are append-only in normal workflows. Event payloads and
audit metadata are sanitized before storage to avoid secrets, stack traces, raw
tokens, and unnecessary customer data.

LeadCreated, LeadAssigned, LeadStatusChanged, LeadSourceChanged,
LeadExhibitionReferenceChanged, and LeadNoteAdded events must include stable
names, versioned payloads, idempotency keys where repeatable submissions are
possible, and correlation identifiers. Event payloads should include identifiers
and safe summary fields only.
