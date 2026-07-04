export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
] as const;

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const LEAD_ACTIONS = [
  "CREATE",
  "VIEW",
  "UPDATE",
  "ASSIGN",
  "CHANGE_STATUS",
  "ADD_NOTE",
  "VIEW_HISTORY",
  "SEARCH",
  "ACTIVITY_CREATE",
  "ACTIVITY_VIEW",
  "ACTIVITY_COMPLETE",
  "ACTIVITY_REASSIGN",
  "ACTIVITY_CANCEL",
  "ACTIVITY_SEARCH",
] as const;

export const LEAD_HISTORY_ENTRY_TYPES = [
  "CREATED",
  "CONTACT_UPDATED",
  "ASSIGNED",
  "STATUS_CHANGED",
  "STATUS_CORRECTED",
  "ARCHIVED",
  "RESTORED",
  "SOURCE_CHANGED",
  "EXHIBITION_REFERENCE_CHANGED",
  "NOTE_ADDED",
  "DUPLICATE_BLOCKED",
  "STALE_UPDATE_REJECTED",
  "ACTIVITY_CREATED",
  "FOLLOW_UP_SCHEDULED",
  "FOLLOW_UP_COMPLETED",
  "FOLLOW_UP_REASSIGNED",
  "ACTIVITY_CANCELED",
  "ACTIVITY_CORRECTED",
  "FOLLOW_UP_STATUS_CHANGED",
] as const;

export const LEAD_DOMAIN_EVENTS = [
  "LeadCreated",
  "LeadAssigned",
  "LeadStatusChanged",
  "LeadSourceChanged",
  "LeadExhibitionReferenceChanged",
  "LeadNoteAdded",
  "ActivityCreated",
  "FollowUpScheduled",
  "FollowUpCompleted",
  "FollowUpReassigned",
  "ActivityCanceled",
  "ActivityCorrected",
  "FollowUpStatusChanged",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];
export type LeadAction = (typeof LEAD_ACTIONS)[number];
export type LeadHistoryEntryType = (typeof LEAD_HISTORY_ENTRY_TYPES)[number];
export type LeadDomainEventName = (typeof LEAD_DOMAIN_EVENTS)[number];

export type LeadAccessScope = "GLOBAL" | "TEAM" | "OWNED" | "EXPLICIT" | "NONE";

export interface LeadUserContext {
  id: string;
  status: string;
  roles: string[];
  activeTeam?: { id: string; name: string; status: string };
}
