export const leadSourceCodes = [
  "EXHIBITION",
  "REFERRAL",
  "WEBSITE",
  "INBOUND_INQUIRY",
  "MANUAL_ENTRY",
  "OTHER",
] as const;

export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
] as const;

export const leadPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type LeadSourceCode = (typeof leadSourceCodes)[number];
export type LeadStatus = (typeof leadStatuses)[number];
export type LeadPriority = (typeof leadPriorities)[number];

export interface LeadFactoryInput {
  displayName?: string;
  company?: string;
  email?: string;
  phone?: string;
  sourceCode?: LeadSourceCode;
  status?: LeadStatus;
  priority?: LeadPriority;
  ownerUserId?: string;
  version?: number;
}

export function createLeadFactoryInput(
  overrides: LeadFactoryInput = {},
): Required<LeadFactoryInput> {
  return {
    displayName: "Acme Opportunity",
    company: "Acme Corp",
    email: "lead@example.com",
    phone: "+15551234567",
    sourceCode: "MANUAL_ENTRY",
    status: "NEW",
    priority: "MEDIUM",
    ownerUserId: "00000000-0000-4000-8000-000000000001",
    version: 1,
    ...overrides,
  };
}
