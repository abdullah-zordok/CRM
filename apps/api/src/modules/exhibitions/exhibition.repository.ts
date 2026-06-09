import { Injectable } from "@nestjs/common";
import type {
  AttendeeStatus,
  AttributionStatus,
  AttributionType,
  ExhibitionStatus,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type {
  ArchiveExhibitionInput,
  AssignExhibitionAttendeeInput,
  AttributeLeadInput,
  ConfirmAttendanceInput,
  CreateExhibitionInput,
  ExhibitionSearchInput,
  RestoreExhibitionInput,
  UpdateExhibitionInput,
} from "./exhibition.schemas.js";

const includeExhibitionDetail = {
  attendees: {
    include: { user: true },
    orderBy: { createdAt: "desc" },
  },
  attributions: {
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  },
  historyEntries: {
    orderBy: { createdAt: "desc" },
    take: 25,
  },
  _count: {
    select: {
      attendees: true,
      attributions: true,
    },
  },
} satisfies Prisma.ExhibitionInclude;

const includeExhibitionSummary = {
  _count: {
    select: {
      attendees: true,
      attributions: true,
    },
  },
} satisfies Prisma.ExhibitionInclude;

const includeAttribution = {
  lead: true,
  exhibition: true,
} satisfies Prisma.ExhibitionLeadAttributionInclude;

export type ExhibitionRecord = Prisma.ExhibitionGetPayload<{
  include: typeof includeExhibitionDetail;
}>;
export type ExhibitionSummaryRecord = Prisma.ExhibitionGetPayload<{
  include: typeof includeExhibitionSummary;
}>;
export type ExhibitionAttributionRecord = Prisma.ExhibitionLeadAttributionGetPayload<{
  include: typeof includeAttribution;
}>;

@Injectable()
export class ExhibitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<ExhibitionRecord | null> {
    return this.prisma.exhibition.findUnique({
      where: { id },
      include: includeExhibitionDetail,
    });
  }

  async search(input: {
    query: ExhibitionSearchInput;
    scope: Prisma.ExhibitionWhereInput;
  }): Promise<{ items: ExhibitionSummaryRecord[]; total: number }> {
    const where: Prisma.ExhibitionWhereInput = {
      AND: [
        input.scope,
        input.query.search
          ? {
              OR: [
                { name: { contains: input.query.search, mode: "insensitive" } },
                { location: { contains: input.query.search, mode: "insensitive" } },
                { notes: { contains: input.query.search, mode: "insensitive" } },
              ],
            }
          : {},
        input.query.status ? { status: input.query.status as ExhibitionStatus } : {},
        input.query.location
          ? { location: { contains: input.query.location, mode: "insensitive" } }
          : {},
        input.query.ownerUserId ? { ownerUserId: input.query.ownerUserId } : {},
        input.query.teamId ? { teamId: input.query.teamId } : {},
        input.query.attendeeUserId
          ? { attendees: { some: { userId: input.query.attendeeUserId } } }
          : {},
        input.query.attributionState === "WITH_LEADS"
          ? { attributions: { some: { status: "ACTIVE" } } }
          : {},
        input.query.attributionState === "WITHOUT_LEADS"
          ? { attributions: { none: { status: "ACTIVE" } } }
          : {},
        input.query.from || input.query.to
          ? {
              startsAt: {
                gte: input.query.from ? new Date(input.query.from) : undefined,
                lte: input.query.to ? new Date(input.query.to) : undefined,
              },
            }
          : {},
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.exhibition.findMany({
        where,
        include: includeExhibitionSummary,
        orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
        skip: ((input.query.page ?? 1) - 1) * (input.query.pageSize ?? 25),
        take: input.query.pageSize ?? 25,
      }),
      this.prisma.exhibition.count({ where }),
    ]);
    return { items, total };
  }

  create(input: {
    data: CreateExhibitionInput;
    actorUserId: string;
    ownerTeamId?: string | null;
    correlationId: string;
  }): Promise<ExhibitionRecord> {
    return this.prisma.exhibition.create({
      data: {
        name: input.data.name,
        startsAt: new Date(input.data.startsAt),
        endsAt: new Date(input.data.endsAt),
        location: input.data.location,
        status: input.data.status as ExhibitionStatus,
        ownerUserId: input.data.ownerUserId,
        teamId: input.data.teamId ?? input.ownerTeamId,
        notes: input.data.notes,
        createdByUserId: input.actorUserId,
        updatedByUserId: input.actorUserId,
        correlationId: input.correlationId,
      },
      include: includeExhibitionDetail,
    });
  }

  async update(
    exhibition: ExhibitionRecord,
    input: UpdateExhibitionInput,
    actorUserId: string,
    ownerTeamId: string | null | undefined,
    correlationId: string,
  ): Promise<ExhibitionRecord | null> {
    const result = await this.prisma.exhibition.updateMany({
      where: { id: exhibition.id, version: input.version },
      data: {
        name: input.name,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
        location: input.location,
        status: input.status as ExhibitionStatus | undefined,
        ownerUserId: input.ownerUserId,
        teamId: input.teamId ?? ownerTeamId,
        notes: input.notes,
        updatedByUserId: actorUserId,
        version: { increment: 1 },
        correlationId,
      },
    });
    if (result.count !== 1) return null;
    return this.findById(exhibition.id);
  }

  async archive(
    id: string,
    input: ArchiveExhibitionInput,
    actorUserId: string,
    correlationId: string,
  ): Promise<ExhibitionRecord | null> {
    const result = await this.prisma.exhibition.updateMany({
      where: { id, version: input.version },
      data: {
        status: "ARCHIVED",
        archiveReason: input.reason,
        archivedAt: new Date(),
        updatedByUserId: actorUserId,
        version: { increment: 1 },
        correlationId,
      },
    });
    if (result.count !== 1) return null;
    return this.findById(id);
  }

  async restore(
    id: string,
    input: RestoreExhibitionInput,
    actorUserId: string,
    correlationId: string,
  ): Promise<ExhibitionRecord | null> {
    const result = await this.prisma.exhibition.updateMany({
      where: { id, version: input.version },
      data: {
        status: input.restoredStatus as ExhibitionStatus,
        archiveReason: null,
        archivedAt: null,
        updatedByUserId: actorUserId,
        version: { increment: 1 },
        correlationId,
      },
    });
    if (result.count !== 1) return null;
    return this.findById(id);
  }

  async getSummary(id: string) {
    const [
      attributedLeadCount,
      attendeeCount,
      confirmedAttendanceCount,
      attributedLeads,
      activities,
    ] = await this.prisma.$transaction([
      this.prisma.exhibitionLeadAttribution.count({
        where: { exhibitionId: id, status: "ACTIVE" },
      }),
      this.prisma.exhibitionAttendee.count({
        where: { exhibitionId: id, status: { not: "REMOVED" } },
      }),
      this.prisma.exhibitionAttendee.count({
        where: { exhibitionId: id, status: "CONFIRMED" },
      }),
      this.prisma.lead.findMany({
        where: {
          exhibitionAttributions: {
            some: { exhibitionId: id, status: "ACTIVE" },
          },
        },
        select: { status: true },
      }),
      this.prisma.activity.findMany({
        where: {
          lead: {
            exhibitionAttributions: {
              some: { exhibitionId: id, status: "ACTIVE" },
            },
          },
        },
        select: { status: true, dueAt: true, createdAt: true },
      }),
    ]);

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      exhibitionId: id,
      attributedLeadCount,
      attendeeCount,
      confirmedAttendanceCount,
      leadStatusDistribution: attributedLeads.reduce<Record<string, number>>((counts, lead) => {
        counts[lead.status] = (counts[lead.status] ?? 0) + 1;
        return counts;
      }, {}),
      openFollowUpCount: activities.filter((activity) => activity.status === "PLANNED").length,
      overdueFollowUpCount: activities.filter(
        (activity) => activity.status === "PLANNED" && activity.dueAt && activity.dueAt < now,
      ).length,
      recentActivityCount: activities.filter((activity) => activity.createdAt >= sevenDaysAgo)
        .length,
      generatedAt: now.toISOString(),
    };
  }

  assignAttendee(input: {
    exhibitionId: string;
    data: AssignExhibitionAttendeeInput;
    teamId?: string | null;
    actorUserId: string;
    correlationId: string;
  }) {
    return this.prisma.exhibitionAttendee.create({
      data: {
        exhibitionId: input.exhibitionId,
        userId: input.data.userId,
        teamId: input.teamId,
        plannedRole: input.data.plannedRole,
        assignedByUserId: input.actorUserId,
        correlationId: input.correlationId,
      },
      include: { user: true },
    });
  }

  async confirmAttendance(input: {
    attendeeId: string;
    data: ConfirmAttendanceInput;
    actorUserId: string;
    correlationId: string;
  }) {
    const result = await this.prisma.exhibitionAttendee.updateMany({
      where: { id: input.attendeeId, version: input.data.version },
      data: {
        status: input.data.status as AttendeeStatus,
        confirmedAt: new Date(),
        confirmedByUserId: input.actorUserId,
        correctionReason: input.data.correctionReason,
        version: { increment: 1 },
        correlationId: input.correlationId,
      },
    });
    if (result.count !== 1) return null;
    return this.prisma.exhibitionAttendee.findUnique({
      where: { id: input.attendeeId },
      include: { user: true },
    });
  }

  findAttendee(id: string) {
    return this.prisma.exhibitionAttendee.findUnique({
      where: { id },
      include: { exhibition: true },
    });
  }

  attributeLead(input: {
    exhibitionId: string;
    data: AttributeLeadInput;
    actorUserId: string;
    sourceReference?: {
      name: string;
      date?: Date | null;
      location?: string | null;
    } | null;
    correlationId: string;
  }): Promise<ExhibitionAttributionRecord> {
    return this.prisma.exhibitionLeadAttribution.create({
      data: {
        exhibitionId: input.exhibitionId,
        leadId: input.data.leadId,
        attributionType: input.data.attributionType as AttributionType,
        sourceReferenceName: input.data.preserveReference ? input.sourceReference?.name : undefined,
        sourceReferenceDate: input.data.preserveReference ? input.sourceReference?.date : undefined,
        sourceReferenceLocation: input.data.preserveReference
          ? input.sourceReference?.location
          : undefined,
        createdByUserId: input.actorUserId,
        correlationId: input.correlationId,
      },
      include: includeAttribution,
    });
  }

  async correctAttribution(input: {
    attributionId: string;
    data: import("./exhibition.schemas.js").CorrectAttributionInput;
    actorUserId: string;
    correlationId: string;
  }): Promise<ExhibitionAttributionRecord | null> {
    const result = await this.prisma.exhibitionLeadAttribution.updateMany({
      where: { id: input.attributionId, version: input.data.version },
      data: {
        status: input.data.status as AttributionStatus,
        correctionReason: input.data.correctionReason,
        updatedByUserId: input.actorUserId,
        version: { increment: 1 },
        correlationId: input.correlationId,
      },
    });
    if (result.count !== 1) return null;
    return this.prisma.exhibitionLeadAttribution.findUnique({
      where: { id: input.attributionId },
      include: includeAttribution,
    });
  }

  findAttribution(id: string): Promise<ExhibitionAttributionRecord | null> {
    return this.prisma.exhibitionLeadAttribution.findUnique({
      where: { id },
      include: includeAttribution,
    });
  }

  findActiveAttribution(exhibitionId: string, leadId: string) {
    return this.prisma.exhibitionLeadAttribution.findFirst({
      where: { exhibitionId, leadId, status: "ACTIVE" },
    });
  }
}
