import type {
  Lead,
  LeadAssignment,
  LeadExhibitionReference,
  LeadHistoryEntry,
  LeadNote,
  LeadSource,
  LeadStatusHistory,
} from "@prisma/client";
import { redactMetadata } from "../users/users.dto.js";

type LeadWithReference = Lead & {
  owner?: { displayName: string } | null;
  creator?: { displayName: string } | null;
  exhibitionReference?: LeadExhibitionReference | null;
  assignments?: LeadAssignment[];
  statusHistory?: LeadStatusHistory[];
  notes?: LeadNote[];
  historyEntries?: LeadHistoryEntry[];
};

export const LeadErrorCode = {
  DuplicateRestricted: "LEAD_DUPLICATE_RESTRICTED",
  DuplicateVisible: "LEAD_DUPLICATE_VISIBLE",
  StaleUpdate: "LEAD_STALE_UPDATE",
  PermissionDenied: "LEAD_PERMISSION_DENIED",
  InvalidStatusTransition: "LEAD_INVALID_STATUS_TRANSITION",
  IneligibleAssignee: "LEAD_INELIGIBLE_ASSIGNEE",
} as const;

export function toLeadSourceDto(source: LeadSource) {
  return {
    code: source.code,
    name: source.name,
    status: source.status,
  };
}

export function toLeadSummaryDto(lead: LeadWithReference, correlationId = "local") {
  return {
    id: lead.id,
    displayName: lead.displayName,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    sourceCode: lead.sourceCode,
    status: lead.status,
    priority: lead.priority,
    budgetAmount: lead.budgetAmount ? Number(lead.budgetAmount) : null,
    budgetCurrency: lead.budgetCurrency,
    ownerUserId: lead.ownerUserId,
    ownerDisplayName: lead.owner?.displayName ?? null,
    teamId: lead.teamId,
    createdByUserId: lead.createdByUserId,
    createdByDisplayName: lead.creator?.displayName ?? null,
    exhibitionReference: lead.exhibitionReference
      ? {
          name: lead.exhibitionReference.name,
          date: lead.exhibitionReference.date?.toISOString().slice(0, 10) ?? null,
          location: lead.exhibitionReference.location,
        }
      : null,
    version: lead.version,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    correlationId,
  };
}

export function toLeadDetailDto(lead: LeadWithReference, correlationId = "local") {
  return {
    ...toLeadSummaryDto(lead, correlationId),
    notes: (lead.notes ?? []).map((note) => ({
      id: note.id,
      leadId: note.leadId,
      authorUserId: note.authorUserId,
      body: note.body,
      createdAt: note.createdAt.toISOString(),
      correlationId: note.correlationId,
    })),
    assignmentHistory: (lead.assignments ?? []).map((assignment) => ({
      id: assignment.id,
      leadId: assignment.leadId,
      fromUserId: assignment.fromUserId,
      toUserId: assignment.toUserId,
      fromTeamId: assignment.fromTeamId,
      toTeamId: assignment.toTeamId,
      assignedByUserId: assignment.assignedByUserId,
      reason: assignment.reason,
      createdAt: assignment.createdAt.toISOString(),
      correlationId: assignment.correlationId,
    })),
    statusHistory: (lead.statusHistory ?? []).map((status) => ({
      id: status.id,
      leadId: status.leadId,
      fromStatus: status.fromStatus,
      toStatus: status.toStatus,
      changedByUserId: status.changedByUserId,
      changeType: status.changeType,
      reason: status.reason,
      createdAt: status.createdAt.toISOString(),
      correlationId: status.correlationId,
    })),
    permissions: {
      canUpdate: true,
      canAssign: true,
      canChangeStatus: true,
      canAddNote: true,
      canViewHistory: true,
    },
  };
}

export function toLeadHistoryResponse(
  entries: LeadHistoryEntry[],
  input: { page: number; pageSize: number; total: number; correlationId: string },
) {
  return {
    items: entries.map((entry) => ({
      id: entry.id,
      leadId: entry.leadId,
      entryType: entry.entryType,
      actorUserId: entry.actorUserId,
      summary: entry.summary,
      metadata: sanitizeLeadMetadata(entry.metadata as Record<string, unknown>),
      createdAt: entry.createdAt.toISOString(),
      correlationId: entry.correlationId,
    })),
    page: input.page,
    pageSize: input.pageSize,
    total: input.total,
    correlationId: input.correlationId,
  };
}

export function sanitizeLeadMetadata(metadata: Record<string, unknown>) {
  return redactMetadata(metadata);
}
