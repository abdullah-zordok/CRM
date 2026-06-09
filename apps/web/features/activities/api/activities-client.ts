const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3101";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: unknown; error?: unknown };
      if (typeof body.message === "string") message = body.message;
      else if (Array.isArray(body.message)) message = body.message.join(" ");
      else if (typeof body.error === "string") message = body.error;
    } catch {
      // Keep the status-based fallback when the API does not return JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "EXHIBITION_VISIT" | "WHATSAPP" | "OTHER";
export type ActivityStoredStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type ActivityStatus =
  | "OPEN"
  | "DUE_TODAY"
  | "OVERDUE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED";
export type ActivityKind = "ACTIVITY" | "FOLLOW_UP";
export type FollowUpStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "OVERDUE";
export type ActivityOutcome =
  | "CONNECTED"
  | "NO_ANSWER"
  | "QUALIFIED_INTEREST"
  | "FOLLOW_UP_REQUIRED"
  | "NOT_INTERESTED"
  | "OTHER";

export interface ActivitySummary {
  id: string;
  leadId: string;
  leadDisplayName: string;
  type: ActivityType;
  status: ActivityStatus;
  kind?: ActivityKind;
  followUpStatus?: FollowUpStatus | null;
  ownerUserId: string;
  ownerDisplayName?: string | null;
  recordedByUserId?: string;
  recordedByDisplayName?: string | null;
  teamId?: string | null;
  activityAt?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  outcome?: ActivityOutcome | null;
  notePreview?: string | null;
  version: number;
  recordedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDetail extends ActivitySummary {
  note?: string | null;
  permissions: {
    canComplete: boolean;
    canReassign: boolean;
    canCancel: boolean;
    canCorrect: boolean;
  };
}

export interface ActivityListResponse {
  items: ActivitySummary[];
  total: number;
  page: number;
  pageSize: number;
  correlationId: string;
}

export interface ActivityTimelineResponse {
  items: ActivityDetail[];
  total: number;
  page: number;
  pageSize: number;
  correlationId: string;
}

export interface CreateActivityInput {
  leadId: string;
  type: ActivityType;
  ownerUserId: string;
  activityAt?: string;
  dueAt?: string;
  outcome?: ActivityOutcome;
  note?: string;
}

export interface CompleteActivityInput {
  version: number;
  outcome: ActivityOutcome;
  completedAt: string;
  note?: string;
}

export interface ReassignActivityInput {
  version: number;
  ownerUserId: string;
  reason?: string;
}

export interface CancelActivityInput {
  version: number;
  reason?: string;
}

export interface UpdateFollowUpStatusInput {
  version: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  outcome?: ActivityOutcome;
  completedAt?: string;
  note?: string;
  reason?: string;
}

export interface ActivitySearchQuery {
  leadId?: string;
  ownerUserId?: string;
  teamId?: string;
  type?: ActivityType;
  status?: ActivityStoredStatus;
  dueState?: ActivityStatus;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

function toSearchParams(query: ActivitySearchQuery = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
}

export function createActivity(input: CreateActivityInput) {
  return request<ActivityDetail>("/activities", { method: "POST", body: JSON.stringify(input) });
}

export function listLeadActivities(
  leadId: string,
  query: { page?: number; pageSize?: number } = {},
) {
  const suffix = toSearchParams(query) ? `?${toSearchParams(query)}` : "";
  return request<ActivityTimelineResponse>(`/leads/${leadId}/activities${suffix}`);
}

export function searchActivities(query: ActivitySearchQuery = {}) {
  const suffix = toSearchParams(query) ? `?${toSearchParams(query)}` : "";
  return request<ActivityListResponse>(`/activities${suffix}`);
}

export function completeActivity(activityId: string, input: CompleteActivityInput) {
  return request<ActivityDetail>(`/activities/${activityId}/complete`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function reassignActivity(activityId: string, input: ReassignActivityInput) {
  return request<ActivityDetail>(`/activities/${activityId}/reassign`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function cancelActivity(activityId: string, input: CancelActivityInput) {
  return request<ActivityDetail>(`/activities/${activityId}/cancel`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function updateFollowUpStatus(activityId: string, input: UpdateFollowUpStatusInput) {
  return request<ActivityDetail>(`/activities/${activityId}/follow-up-status`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export { toSearchParams as serializeActivitySearchQuery };
