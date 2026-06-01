import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
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
export class LeadAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assign(input: {
    leadId: string;
    version: number;
    fromUserId: string;
    toUserId: string;
    fromTeamId?: string | null;
    toTeamId?: string | null;
    assignedByUserId: string;
    reason?: string;
    correlationId: string;
  }): Promise<LeadRecord | null> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lead.updateMany({
        where: { id: input.leadId, version: input.version },
        data: {
          ownerUserId: input.toUserId,
          teamId: input.toTeamId,
          version: { increment: 1 },
        },
      });
      if (updated.count !== 1) return null;

      const assignment = await tx.leadAssignment.create({
        data: {
          leadId: input.leadId,
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          fromTeamId: input.fromTeamId,
          toTeamId: input.toTeamId,
          assignedByUserId: input.assignedByUserId,
          reason: input.reason,
          correlationId: input.correlationId,
        },
      });

      await tx.leadHistoryEntry.create({
        data: {
          leadId: input.leadId,
          entryType: "ASSIGNED",
          actorUserId: input.assignedByUserId,
          summary: "Lead assignment changed",
          metadata: {
            assignmentId: assignment.id,
            fromUserId: input.fromUserId,
            toUserId: input.toUserId,
            fromTeamId: input.fromTeamId ?? null,
            toTeamId: input.toTeamId ?? null,
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
