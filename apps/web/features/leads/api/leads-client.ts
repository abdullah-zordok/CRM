import { getBrowserApiBaseUrl } from "../../foundation/api/api-base-url";

const API_BASE_URL = getBrowserApiBaseUrl();

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
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(" ");
      } else if (typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      // Keep the status-based fallback when the API does not return JSON.
    }
    throw new Error(message);
  }
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
  ownerDisplayName?: string | null;
  teamId?: string | null;
  createdByUserId?: string;
  createdByDisplayName?: string | null;
  exhibitionReference?: { name: string; date?: string | null; location?: string | null } | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadAssignmentHistory {
  previousOwner?: { id: string; displayName: string } | null;
  newOwner?: { id: string; displayName: string } | null;
  assignedBy?: { id: string; displayName: string } | null;
  reason?: string | null;
  assignedAt: string;
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
  ownerUserId?: string;
  budgetAmount?: number;
  budgetCurrency?: string;
  exhibitionReference?: { name: string; date?: string; location?: string };
  initialNote?: string;
}

export interface LeadImportPreviewRow {
  row: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  validationStatus: "VALID" | "INVALID";
  errorMessage: string;
}

export interface LeadImportResult {
  importedCount: number;
  skippedCount: number;
}

interface LeadImportPayload {
  fileName: string;
  contentBase64: string;
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

export function getLead(leadId: string, init?: RequestInit) {
  return request<LeadDetail>(`/leads/${leadId}`, init);
}

export function updateLead(leadId: string, input: Partial<CreateLeadInput> & { version: number }) {
  return request<LeadDetail>(`/leads/${leadId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
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

export async function exportLeads(format: "csv" | "xlsx" = "csv") {
  const result = await listLeads({ pageSize: 100 });
  const extension = format === "xlsx" ? "csv" : format;
  downloadCsv(`leads.${extension}`, [
    ["Name", "Company", "Phone", "Email", "Source", "Status", "Priority", "Created At"],
    ...result.items.map((lead) => [
      lead.displayName,
      lead.company ?? "",
      lead.phone ?? "",
      lead.email ?? "",
      lead.sourceCode,
      lead.status,
      lead.priority,
      lead.createdAt,
    ]),
  ]);
}

export async function downloadLeadImportTemplate(format: "csv" | "xlsx" = "csv") {
  const extension = format === "xlsx" ? "csv" : format;
  downloadCsv(`lead-import-template.${extension}`, [
    ["Name", "Phone", "Email", "Source", "Status", "Priority"],
    ["Acme Lead", "+15551234567", "lead@example.com", "MANUAL_ENTRY", "NEW", "MEDIUM"],
  ]);
}

export async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function previewLeadImport(input: LeadImportPayload): Promise<{
  rows: LeadImportPreviewRow[];
}> {
  if (!input.fileName.toLowerCase().endsWith(".csv")) {
    throw new Error("Lead import preview currently supports CSV files.");
  }

  const rows = parseCsv(decodeBase64Utf8(input.contentBase64));
  const [headers = [], ...records] = rows;
  const headerIndex = new Map(headers.map((header, index) => [header.trim().toLowerCase(), index]));
  const get = (row: string[], ...names: string[]) => {
    for (const name of names) {
      const index = headerIndex.get(name.toLowerCase());
      if (index !== undefined) return row[index]?.trim() ?? "";
    }
    return "";
  };

  return {
    rows: records
      .filter((row) => row.some((cell) => cell.trim()))
      .map((record, index) => {
        const name = get(record, "name", "displayName");
        const phone = get(record, "phone");
        const email = get(record, "email");
        const source = get(record, "source", "sourceCode") || "MANUAL_ENTRY";
        const status = normalizeLeadStatus(get(record, "status") || "NEW");
        const priority = normalizeLeadPriority(get(record, "priority") || "MEDIUM");
        const errors = [
          name ? "" : "Name is required.",
          phone || email ? "" : "Phone or email is required.",
          priority ? "" : "Priority is invalid.",
          status ? "" : "Status is invalid.",
        ].filter(Boolean);

        return {
          row: index + 2,
          name,
          phone,
          email,
          source,
          status: status ?? "NEW",
          priority: priority ?? "MEDIUM",
          validationStatus: errors.length === 0 ? "VALID" : "INVALID",
          errorMessage: errors.join(" "),
        };
      }),
  };
}

export async function confirmLeadImport(input: LeadImportPayload): Promise<LeadImportResult> {
  const preview = await previewLeadImport(input);
  let importedCount = 0;
  let skippedCount = 0;

  for (const row of preview.rows) {
    if (row.validationStatus !== "VALID") {
      skippedCount += 1;
      continue;
    }
    try {
      await createLead({
        displayName: row.name,
        phone: row.phone || undefined,
        email: row.email || undefined,
        sourceCode: row.source,
        priority: row.priority,
      });
      importedCount += 1;
    } catch {
      skippedCount += 1;
    }
  }

  return { importedCount, skippedCount };
}

function downloadCsv(fileName: string, rows: string[][]) {
  if (typeof document === "undefined") return;
  const blob = new Blob([rowsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function rowsToCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => (/[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell))
        .join(","),
    )
    .join("\r\n");
}

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

function decodeBase64Utf8(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function normalizeLeadStatus(value: string): LeadStatus | null {
  return ["NEW", "CONTACTED", "QUALIFIED", "NEGOTIATION", "WON", "LOST", "ARCHIVED"].includes(value)
    ? (value as LeadStatus)
    : null;
}

function normalizeLeadPriority(value: string): LeadPriority | null {
  return ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(value) ? (value as LeadPriority) : null;
}
