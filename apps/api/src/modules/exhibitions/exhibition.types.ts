export type ExhibitionStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELED" | "ARCHIVED";

export type AttendeeStatus = "PLANNED" | "CONFIRMED" | "ABSENT" | "REMOVED" | "CORRECTED";

export type AttributionType = "SOURCE" | "INFLUENCE" | "CORRECTION";

export type AttributionStatus = "ACTIVE" | "REMOVED" | "CORRECTED";

export type ExhibitionHistoryEntryType =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "ARCHIVED"
  | "RESTORED"
  | "ATTENDEE_ASSIGNED"
  | "ATTENDANCE_CONFIRMED"
  | "ATTENDANCE_CORRECTED"
  | "LEAD_ATTRIBUTED"
  | "ATTRIBUTION_CORRECTED"
  | "ATTRIBUTION_REMOVED"
  | "STALE_UPDATE_REJECTED"
  | "ACCESS_DENIED";

export type ExhibitionAction =
  | "CREATE"
  | "VIEW"
  | "UPDATE"
  | "ARCHIVE"
  | "RESTORE"
  | "ASSIGN_ATTENDEE"
  | "CONFIRM_ATTENDANCE"
  | "ATTRIBUTE_LEAD"
  | "VIEW_SUMMARY"
  | "SEARCH";

export type ExhibitionAccessScope =
  | "GLOBAL"
  | "TEAM"
  | "ATTENDEE"
  | "OWNED_LEAD"
  | "EXPLICIT"
  | "NONE";

export type ExhibitionDomainEventName =
  | "ExhibitionCreated"
  | "ExhibitionUpdated"
  | "ExhibitionStatusChanged"
  | "ExhibitionAttendeeAssigned"
  | "ExhibitionAttendanceConfirmed"
  | "ExhibitionLeadAttributed"
  | "ExhibitionAttributionCorrected";
