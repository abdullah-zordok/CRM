export const ACTIVITY_TYPES = [
  "CALL",
  "EMAIL",
  "MEETING",
  "EXHIBITION_VISIT",
  "WHATSAPP",
  "OTHER",
] as const;

export const ACTIVITY_STATUSES = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELED"] as const;

export const ACTIVITY_DUE_STATES = [
  "OPEN",
  "DUE_TODAY",
  "OVERDUE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
] as const;

export const ACTIVITY_OUTCOMES = [
  "CONNECTED",
  "NO_ANSWER",
  "QUALIFIED_INTEREST",
  "FOLLOW_UP_REQUIRED",
  "NOT_INTERESTED",
  "OTHER",
] as const;

export const ACTIVITY_DOMAIN_EVENTS = [
  "ActivityCreated",
  "FollowUpScheduled",
  "FollowUpCompleted",
  "FollowUpReassigned",
  "FollowUpStatusChanged",
  "ActivityCanceled",
  "ActivityCorrected",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];
export type ActivityDueState = (typeof ACTIVITY_DUE_STATES)[number];
export type ActivityOutcome = (typeof ACTIVITY_OUTCOMES)[number];
export type ActivityDomainEventName = (typeof ACTIVITY_DOMAIN_EVENTS)[number];

export function resolveActivityDueState(input: {
  status: ActivityStatus;
  dueAt?: Date | null;
  now?: Date;
}): ActivityDueState {
  if (input.status === "COMPLETED") return "COMPLETED";
  if (input.status === "CANCELED") return "CANCELED";
  if (!input.dueAt) return "OPEN";

  const now = input.now ?? new Date();
  const due = input.dueAt;
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  if (due < startOfToday) return "OVERDUE";
  if (input.status === "IN_PROGRESS") return "IN_PROGRESS";
  if (due >= startOfToday && due < startOfTomorrow) return "DUE_TODAY";
  return "OPEN";
}

export function containsSensitiveActivityText(value: string | undefined): boolean {
  if (!value) return false;
  return /(password|passwd|secret|api[_ -]?key|token|credit card|card number|cvv|iban)/i.test(
    value,
  );
}
