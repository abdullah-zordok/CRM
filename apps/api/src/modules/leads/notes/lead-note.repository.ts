import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import type { LeadRecord } from "../leads.repository.js";

const includeLeadDetail = {
  owner: { select: { displayName: true } },
  creator: { select: { displayName: true } },
  exhibitionReference: true,
  assignments: { orderBy: { createdAt: "desc" } },
  statusHistory: { orderBy: { createdAt: "desc" } },
  notes: { orderBy: { createdAt: "desc" } },
  historyEntries: { orderBy: { createdAt: "desc" } },
} satisfies Prisma.LeadInclude;

@Injectable()
export class LeadNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addNote(input: {
    leadId: string;
    version: number;
    authorUserId: string;
    body: string;
    correlationId: string;
  }): Promise<LeadRecord | null> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lead.updateMany({
        where: { id: input.leadId, version: input.version },
        data: { version: { increment: 1 } },
      });
      if (updated.count !== 1) return null;

      const note = await tx.leadNote.create({
        data: {
          leadId: input.leadId,
          authorUserId: input.authorUserId,
          body: input.body,
          correlationId: input.correlationId,
        },
      });

      await tx.leadHistoryEntry.create({
        data: {
          leadId: input.leadId,
          entryType: "NOTE_ADDED",
          actorUserId: input.authorUserId,
          summary: "Lead note added",
          metadata: { noteId: note.id },
          correlationId: input.correlationId,
        },
      });

      return tx.lead.findUnique({
        where: { id: input.leadId },
        include: includeLeadDetail,
      });
    });
  }
}
