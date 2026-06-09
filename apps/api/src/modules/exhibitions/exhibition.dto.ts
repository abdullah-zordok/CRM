import type {
  Exhibition,
  ExhibitionAttendee,
  ExhibitionHistoryEntry,
  ExhibitionLeadAttribution,
} from "@prisma/client";

export function mapExhibitionToSummaryDto(
  exhibition: Exhibition & {
    _count?: {
      attendees: number;
      attributions: number;
    };
  },
) {
  return {
    id: exhibition.id,
    name: exhibition.name,
    status: exhibition.status,
    startsAt: exhibition.startsAt.toISOString(),
    endsAt: exhibition.endsAt.toISOString(),
    location: exhibition.location,
    ownerUserId: exhibition.ownerUserId,
    teamId: exhibition.teamId,
    attendeeCount: exhibition._count?.attendees ?? 0,
    attributedLeadCount: exhibition._count?.attributions ?? 0,
    overdueFollowUpCount: 0, // This would be populated by the repository
    version: exhibition.version,
  };
}

export function mapExhibitionToDetailDto(
  exhibition: Exhibition & { historyEntries?: ExhibitionHistoryEntry[] },
  attendees: (ExhibitionAttendee & { user?: { displayName: string } })[],
  attributions: (ExhibitionLeadAttribution & { lead?: { displayName: string } })[],
  summary: Record<string, unknown>,
) {
  return {
    ...mapExhibitionToSummaryDto(exhibition),
    notes: exhibition.notes,
    attendees: attendees.map((a) => ({
      id: a.id,
      exhibitionId: a.exhibitionId,
      userId: a.userId,
      displayName: a.user?.displayName ?? "Unknown",
      teamId: a.teamId,
      plannedRole: a.plannedRole,
      status: a.status,
      confirmedAt: a.confirmedAt?.toISOString() ?? null,
      version: a.version,
      createdAt: a.createdAt.toISOString(),
    })),
    attributions: attributions.map((a) => ({
      id: a.id,
      exhibitionId: a.exhibitionId,
      leadId: a.leadId,
      leadDisplayName: a.lead?.displayName ?? "Unknown",
      attributionType: a.attributionType,
      status: a.status,
      sourceReferenceName: a.sourceReferenceName,
      version: a.version,
      createdAt: a.createdAt.toISOString(),
    })),
    historyEntries: (exhibition.historyEntries ?? []).map((entry) => ({
      id: entry.id,
      entryType: entry.entryType,
      actorUserId: entry.actorUserId,
      leadId: entry.leadId,
      attendeeUserId: entry.attendeeUserId,
      summary: entry.summary,
      metadata: entry.metadata,
      createdAt: entry.createdAt.toISOString(),
      correlationId: entry.correlationId,
    })),
    summary,
    correlationId: exhibition.correlationId,
  };
}

export function redactExhibitionNotes(notes: string | null): string | null {
  if (!notes) return null;
  // Simple redaction logic for testing - in reality this would check for secrets/PII
  return notes.replace(/\b(?:\d{4}-){3}\d{4}\b/g, "****-****-****-****");
}
