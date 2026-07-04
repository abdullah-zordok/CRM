const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3501";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "content-type": "application/json" },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

export type DashboardScope = "ADMIN_GLOBAL" | "MANAGER_TEAM";
export type DashboardLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ARCHIVED";

export interface OperationsDashboardQuery {
  search?: string;
  status?: DashboardLeadStatus;
  page?: number;
  pageSize?: number;
}

export interface DashboardSummary {
  totalLeads: number;
  totalUsers: number;
  salesRepresentatives: number;
}

export interface DashboardUserOverview {
  id: string;
  displayName: string;
  email: string;
  leadCount: number;
}

export interface DashboardUserReference {
  id: string;
  displayName: string;
}

export interface DashboardLead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdBy: DashboardUserReference | null;
  currentOwner: DashboardUserReference | null;
  createdAt: string;
  status: string;
}

export interface DashboardPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OperationsDashboardResponse {
  scope: DashboardScope;
  summary: DashboardSummary;
  usersOverview: DashboardUserOverview[];
  leads: DashboardLead[];
  pagination: DashboardPagination;
  generatedAt: string;
}

export function getOperationsDashboard(query: OperationsDashboardQuery = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<OperationsDashboardResponse>(`/dashboard/operations${suffix}`);
}
