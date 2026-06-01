import { Injectable } from "@nestjs/common";
import type { LeadStatus, LeadStatusChangeType, Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import type { LeadRecord } from "../leads.repository.js";

const includeLeadDetail = {
  exhibitionReference: true,
  assignments: {
    orderBy: { createdAt: "desc" },
  },
  statusHistory: {
    orderBy: { createdAt: "desc" },
  },
  notes: {
    orderBy: { createdAt: "desc" },
  },
  historyEntries: {
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.LeadInclude;

@Injectable()
export class LeadStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async changeStatus(input: {
    leadId: string;
    version: number;
    fromStatus: LeadStatus;
    toStatus: LeadStatus;
    changeType: LeadStatusChangeType;
    changedByUserId: string;
    reason?: string;
    correlationId: string;
  }): Promise<LeadRecord | null> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lead.updateMany({
        where: { id: input.leadId, version: input.version },
        data: {
          status: input.toStatus,
          archivedAt: input.toStatus === "ARCHIVED" ? new Date() : null,
          version: { increment: 1 },
        },
      });
      if (updated.count !== 1) return null;

      const history = await tx.leadStatusHistory.create({
        data: {
          leadId: input.leadId,
          fromStatus: input.fromStatus,
          toStatus: input.toStatus,
          changedByUserId: input.changedByUserId,
          changeType: input.changeType,
          reason: input.reason,
          correlationId: input.correlationId,
        },
      });

      await tx.leadHistoryEntry.create({
        data: {
          leadId: input.leadId,
          entryType:
            input.changeType === "ARCHIVE"
              ? "ARCHIVED"
              : input.changeType === "RESTORE"
                ? "RESTORED"
                : input.changeType === "CORRECTION"
                  ? "STATUS_CORRECTED"
                  : "STATUS_CHANGED",
          actorUserId: input.changedByUserId,
          summary: "Lead status changed",
          metadata: {
            statusHistoryId: history.id,
            fromStatus: input.fromStatus,
            toStatus: input.toStatus,
            changeType: input.changeType,
          },
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
