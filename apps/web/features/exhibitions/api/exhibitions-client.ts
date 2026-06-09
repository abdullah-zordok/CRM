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
      // Keep the status fallback.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type ExhibitionStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELED" | "ARCHIVED";
export type AttendeeStatus = "PLANNED" | "CONFIRMED" | "ABSENT" | "REMOVED" | "CORRECTED";
export type AttributionType = "SOURCE" | "INFLUENCE" | "CORRECTION";
export type AttributionStatus = "ACTIVE" | "REMOVED" | "CORRECTED";

export interface ExhibitionSummary {
  id: string;
  name: string;
  status: ExhibitionStatus;
  startsAt: string;
  endsAt: string;
  location: string;
  ownerUserId: string;
  teamId?: string | null;
  attendeeCount: number;
  attributedLeadCount: number;
  overdueFollowUpCount: number;
  version: number;
}

export interface ExhibitionAttendee {
  id: string;
  exhibitionId: string;
  userId: string;
  displayName: string;
  teamId?: string | null;
  plannedRole?: string | null;
  status: AttendeeStatus;
  confirmedAt?: string | null;
  version: number;
  createdAt: string;
}

export interface ExhibitionLeadAttribution {
  id: string;
  exhibitionId: string;
  leadId: string;
  leadDisplayName: string;
  attributionType: AttributionType;
  status: AttributionStatus;
  sourceReferenceName?: string | null;
  version: number;
  createdAt: string;
}

export interface ExhibitionHistoryEntry {
  id: string;
  entryType: string;
  actorUserId?: string | null;
  leadId?: string | null;
  attendeeUserId?: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  correlationId: string;
}

export interface ExhibitionPerformanceSummary {
  exhibitionId: string;
  attributedLeadCount: number;
  attendeeCount: number;
  confirmedAttendanceCount: number;
  leadStatusDistribution: Record<string, number>;
  openFollowUpCount: number;
  overdueFollowUpCount: number;
  recentActivityCount: number;
  generatedAt: string;
}

export interface ExhibitionDetail extends ExhibitionSummary {
  notes?: string | null;
  attendees: ExhibitionAttendee[];
  attributions: ExhibitionLeadAttribution[];
  historyEntries: ExhibitionHistoryEntry[];
  summary: ExhibitionPerformanceSummary;
  correlationId: string;
}

export interface ExhibitionSearchQuery {
  search?: string;
  status?: ExhibitionStatus;
  from?: string;
  to?: string;
  location?: string;
  ownerUserId?: string;
  teamId?: string;
  attendeeUserId?: string;
  attributionState?: "WITH_LEADS" | "WITHOUT_LEADS";
  page?: number;
  pageSize?: number;
}

export interface CreateExhibitionInput {
  name: string;
  startsAt: string;
  endsAt: string;
  location: string;
  status: ExhibitionStatus;
  ownerUserId: string;
  teamId?: string | null;
  notes?: string;
}

function queryString(query: object) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const suffix = params.toString();
  return suffix ? `?${suffix}` : "";
}

export function searchExhibitions(query: ExhibitionSearchQuery = {}) {
  return request<{ items: ExhibitionSummary[]; total: number; page: number; pageSize: number }>(
    `/exhibitions${queryString(query)}`,
  );
}

export function createExhibition(input: CreateExhibitionInput) {
  return request<ExhibitionDetail>("/exhibitions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getExhibition(id: string) {
  return request<ExhibitionDetail>(`/exhibitions/${id}`);
}

export function updateExhibition(
  id: string,
  input: Partial<CreateExhibitionInput> & { version: number },
) {
  return request<ExhibitionDetail>(`/exhibitions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function archiveExhibition(id: string, input: { version: number; reason?: string }) {
  return request<ExhibitionDetail>(`/exhibitions/${id}/archive`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function restoreExhibition(
  id: string,
  input: { version: number; restoredStatus: Exclude<ExhibitionStatus, "ARCHIVED"> },
) {
  return request<ExhibitionDetail>(`/exhibitions/${id}/restore`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function assignAttendee(id: string, input: { userId: string; plannedRole?: string }) {
  return request<ExhibitionAttendee>(`/exhibitions/${id}/attendees`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function confirmAttendance(
  exhibitionId: string,
  attendeeId: string,
  input: { status: AttendeeStatus; correctionReason?: string; version: number },
) {
  return request<ExhibitionAttendee>(
    `/exhibitions/${exhibitionId}/attendees/${attendeeId}/confirm`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function attributeLead(
  id: string,
  input: { leadId: string; attributionType: AttributionType; preserveReference?: boolean },
) {
  return request<ExhibitionLeadAttribution>(`/exhibitions/${id}/lead-attributions`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function correctAttribution(
  exhibitionId: string,
  attributionId: string,
  input: { status: AttributionStatus; correctionReason?: string; version: number },
) {
  return request<ExhibitionLeadAttribution>(
    `/exhibitions/${exhibitionId}/lead-attributions/${attributionId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function getExhibitionSummary(id: string) {
  return request<ExhibitionPerformanceSummary>(`/exhibitions/${id}/summary`);
}
