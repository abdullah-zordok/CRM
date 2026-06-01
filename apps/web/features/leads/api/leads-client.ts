const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ARCHIVED";
export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface LeadSummary {
  id: string;
  displayName: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  sourceCode: string;
  status: LeadStatus;
  priority: LeadPriority;
  budgetAmount?: number | null;
  budgetCurrency?: string | null;
  ownerUserId: string;
  teamId?: string | null;
  createdByUserId?: string;
  exhibitionReference?: { name: string; date?: string | null; location?: string | null } | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadAssignmentHistory {
  id: string;
  leadId: string;
  fromUserId?: string | null;
  toUserId: string;
  fromTeamId?: string | null;
  toTeamId?: string | null;
  assignedByUserId: string;
  reason?: string | null;
  createdAt: string;
  correlationId: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  fromStatus?: LeadStatus | null;
  toStatus: LeadStatus;
  changedByUserId: string;
  changeType: "NORMAL_FLOW" | "CORRECTION" | "ARCHIVE" | "RESTORE";
  reason?: string | null;
  createdAt: string;
  correlationId: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  correlationId: string;
}

export interface LeadHistoryEntry {
  id: string;
  leadId: string;
  entryType: string;
  actorUserId?: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  correlationId: string;
}

export interface LeadDetail extends LeadSummary {
  assignmentHistory: LeadAssignmentHistory[];
  statusHistory: LeadStatusHistory[];
  notes: LeadNote[];
  permissions: {
    canUpdate: boolean;
    canAssign: boolean;
    canChangeStatus: boolean;
    canAddNote: boolean;
    canViewHistory: boolean;
  };
}

export interface LeadSource {
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateLeadInput {
  displayName?: string;
  company?: string;
  email?: string;
  phone?: string;
  sourceCode: string;
  priority: LeadPriority;
  ownerUserId: string;
  budgetAmount?: number;
  budgetCurrency?: string;
  exhibitionReference?: { name: string; date?: string; location?: string };
  initialNote?: string;
}

export interface LeadListQuery {
  search?: string;
  status?: LeadStatus;
  sourceCode?: string;
  priority?: LeadPriority;
  ownerUserId?: string;
  teamId?: string;
  exhibition?: string;
  page?: number;
  pageSize?: number;
}

export function listLeads(query: LeadListQuery = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request<{ items: LeadSummary[]; total: number; page: number; pageSize: number }>(
    `/leads${suffix}`,
  );
}

export function getLead(leadId: string) {
  return request<LeadDetail>(`/leads/${leadId}`);
}

export function listLeadSources() {
  return request<{ items: LeadSource[] }>("/leads/sources");
}

export function createLead(input: CreateLeadInput) {
  return request<LeadSummary>("/leads", { method: "POST", body: JSON.stringify(input) });
}

export function assignLead(
  leadId: string,
  input: { ownerUserId: string; reason?: string; version: number },
) {
  return request<LeadDetail>(`/leads/${leadId}/assignment`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function changeLeadStatus(
  leadId: string,
  input: { status: LeadStatus; reason?: string; version: number },
) {
  return request<LeadDetail>(`/leads/${leadId}/status`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function addLeadNote(leadId: string, input: { body: string; version: number }) {
  return request<LeadDetail>(`/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getLeadHistory(leadId: string, query: { page?: number; pageSize?: number } = {}) {
  const search = new URLSearchParams();
  if (query.page) search.set("page", String(query.page));
  if (query.pageSize) search.set("pageSize", String(query.pageSize));
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request<{ items: LeadHistoryEntry[]; total: number; page: number; pageSize: number }>(
    `/leads/${leadId}/history${suffix}`,
  );
}
