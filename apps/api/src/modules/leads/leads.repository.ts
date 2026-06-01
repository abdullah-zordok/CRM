import { Injectable } from "@nestjs/common";
import type { Lead, Prisma } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import {
  normalizeEmail,
  normalizePhone,
  type CreateLeadInput,
  type LeadSearchInput,
} from "./leads.schemas.js";

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

export type LeadRecord = Prisma.LeadGetPayload<{ include: typeof includeLeadDetail }>;

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  listSources() {
    return this.prisma.leadSource.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
  }

  findSource(code: string) {
    return this.prisma.leadSource.findFirst({ where: { code, status: "ACTIVE" } });
  }

  findById(leadId: string): Promise<LeadRecord | null> {
    return this.prisma.lead.findUnique({
      where: { id: leadId },
      include: includeLeadDetail,
    });
  }

  async findActiveDuplicate(input: { email?: string; phone?: string }): Promise<Lead | null> {
    const normalizedEmail = normalizeEmail(input.email);
    const normalizedPhone = normalizePhone(input.phone);
    if (!normalizedEmail && !normalizedPhone) return null;
    return this.prisma.lead.findFirst({
      where: {
        archivedAt: null,
        OR: [
          ...(normalizedEmail ? [{ normalizedEmail }] : []),
          ...(normalizedPhone ? [{ normalizedPhone }] : []),
        ],
      },
    });
  }

  async create(input: {
    data: CreateLeadInput;
    createdByUserId: string;
    teamId?: string;
    correlationId: string;
  }): Promise<LeadRecord> {
    const normalizedEmail = normalizeEmail(input.data.email);
    const normalizedPhone = normalizePhone(input.data.phone);
    return this.prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          displayName: input.data.displayName ?? input.data.company ?? "Untitled Lead",
          company: input.data.company,
          email: input.data.email,
          normalizedEmail,
          phone: input.data.phone,
          normalizedPhone,
          sourceCode: input.data.sourceCode,
          status: "NEW",
          priority: input.data.priority,
          budgetAmount: input.data.budgetAmount,
          budgetCurrency: input.data.budgetCurrency,
          ownerUserId: input.data.ownerUserId,
          teamId: input.teamId,
          createdByUserId: input.createdByUserId,
          exhibitionReference: input.data.exhibitionReference
            ? {
                create: {
                  name: input.data.exhibitionReference.name,
                  date: input.data.exhibitionReference.date
                    ? new Date(input.data.exhibitionReference.date)
                    : undefined,
                  location: input.data.exhibitionReference.location,
                  createdByUserId: input.createdByUserId,
                  updatedByUserId: input.createdByUserId,
                },
              }
            : undefined,
        },
        include: includeLeadDetail,
      });

      await tx.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          toStatus: "NEW",
          changedByUserId: input.createdByUserId,
          changeType: "NORMAL_FLOW",
          correlationId: input.correlationId,
        },
      });

      await tx.leadAssignment.create({
        data: {
          leadId: lead.id,
          toUserId: input.data.ownerUserId,
          toTeamId: input.teamId,
          assignedByUserId: input.createdByUserId,
          reason: "Initial lead owner",
          correlationId: input.correlationId,
        },
      });

      await tx.leadHistoryEntry.create({
        data: {
          leadId: lead.id,
          entryType: "CREATED",
          actorUserId: input.createdByUserId,
          summary: "Lead created",
          metadata: { sourceCode: lead.sourceCode, priority: lead.priority },
          correlationId: input.correlationId,
        },
      });

      if (input.data.initialNote) {
        await tx.leadNote.create({
          data: {
            leadId: lead.id,
            authorUserId: input.createdByUserId,
            body: input.data.initialNote,
            correlationId: input.correlationId,
          },
        });
      }

      return lead;
    });
  }

  async search(input: { query: LeadSearchInput; scope: Prisma.LeadWhereInput }): Promise<{
    items: LeadRecord[];
    total: number;
  }> {
    const {
      page,
      pageSize,
      search,
      status,
      sourceCode,
      priority,
      ownerUserId,
      teamId,
      exhibition,
    } = input.query;
    const where: Prisma.LeadWhereInput = {
      AND: [
        input.scope,
        status ? { status } : {},
        sourceCode ? { sourceCode } : {},
        priority ? { priority } : {},
        ownerUserId ? { ownerUserId } : {},
        teamId ? { teamId } : {},
        search
          ? {
              OR: [
                { displayName: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        exhibition
          ? { exhibitionReference: { name: { contains: exhibition, mode: "insensitive" } } }
          : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        include: includeLeadDetail,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.lead.count({ where }),
    ]);
    return { items, total };
  }
}
