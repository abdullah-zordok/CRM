import { Injectable } from "@nestjs/common";
import type { ActivityStatus, ActivityType, Prisma } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import type {
  ActivitySearchInput,
  CancelActivityInput,
  CompleteActivityInput,
  CreateActivityInput,
  ReassignActivityInput,
  UpdateFollowUpStatusInput,
} from "./activity.schemas.js";

const includeActivity = {
  lead: true,
  owner: {
    select: {
      id: true,
      displayName: true,
    },
  },
  recorder: {
    select: {
      id: true,
      displayName: true,
    },
  },
} satisfies Prisma.ActivityInclude;

export type ActivityRecord = Prisma.ActivityGetPayload<{ include: typeof includeActivity }>;

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(activityId: string): Promise<ActivityRecord | null> {
    return this.prisma.activity.findUnique({
      where: { id: activityId },
      include: includeActivity,
    });
  }

  async create(input: {
    data: CreateActivityInput;
    status: ActivityStatus;
    recordedByUserId: string;
    teamId?: string | null;
    correlationId: string;
  }): Promise<ActivityRecord> {
    return this.prisma.$transaction(async (tx) => {
      const activity = await tx.activity.create({
        data: {
          leadId: input.data.leadId,
          type: input.data.type as ActivityType,
          status: input.status,
          ownerUserId: input.data.ownerUserId,
          teamId: input.teamId,
          recordedByUserId: input.recordedByUserId,
          activityAt: input.data.activityAt ? new Date(input.data.activityAt) : undefined,
          dueAt: input.data.dueAt ? new Date(input.data.dueAt) : undefined,
          outcome: input.data.outcome,
          note: input.data.note,
          correlationId: input.correlationId,
        },
        include: includeActivity,
      });
      await tx.leadHistoryEntry.create({
        data: {
          leadId: input.data.leadId,
          entryType: input.status === "PLANNED" ? "FOLLOW_UP_SCHEDULED" : "ACTIVITY_CREATED",
          actorUserId: input.recordedByUserId,
          summary: input.status === "PLANNED" ? "Follow-up scheduled" : "Activity recorded",
          metadata: { activityId: activity.id, type: activity.type, status: activity.status },
          correlationId: input.correlationId,
        },
      });
      return activity;
    });
  }

  async listForLead(input: {
    leadId: string;
    page: number;
    pageSize: number;
  }): Promise<{ items: ActivityRecord[]; total: number }> {
    const where: Prisma.ActivityWhereInput = { leadId: input.leadId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.activity.findMany({
        where,
        include: includeActivity,
        orderBy: [{ dueAt: "asc" }, { activityAt: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prisma.activity.count({ where }),
    ]);
    return { items, total };
  }

  async search(input: {
    query: ActivitySearchInput;
    scope: Prisma.ActivityWhereInput;
  }): Promise<{ items: ActivityRecord[]; total: number }> {
    const where: Prisma.ActivityWhereInput = {
      AND: [
        input.scope,
        input.query.leadId ? { leadId: input.query.leadId } : {},
        input.query.ownerUserId ? { ownerUserId: input.query.ownerUserId } : {},
        input.query.teamId ? { teamId: input.query.teamId } : {},
        input.query.type ? { type: input.query.type } : {},
        input.query.status ? { status: input.query.status as ActivityStatus } : {},
        this.whereForDueState(input.query.dueState),
        input.query.from || input.query.to
          ? {
              OR: [
                {
                  activityAt: {
                    gte: input.query.from ? new Date(input.query.from) : undefined,
                    lte: input.query.to ? new Date(input.query.to) : undefined,
                  },
                },
                {
                  dueAt: {
                    gte: input.query.from ? new Date(input.query.from) : undefined,
                    lte: input.query.to ? new Date(input.query.to) : undefined,
                  },
                },
              ],
            }
          : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.activity.findMany({
        where,
        include: includeActivity,
        orderBy: [{ dueAt: "asc" }, { activityAt: "desc" }, { createdAt: "desc" }],
        skip: (input.query.page - 1) * input.query.pageSize,
        take: input.query.pageSize,
      }),
      this.prisma.activity.count({ where }),
    ]);
    return { items, total };
  }

  complete(
    activity: ActivityRecord,
    input: CompleteActivityInput,
    correlationId: string,
  ): Promise<ActivityRecord | null> {
    return this.updateWithVersion(activity.id, input.version, {
      status: "COMPLETED",
      completedAt: new Date(input.completedAt),
      outcome: input.outcome,
      note: input.note ?? activity.note,
      version: { increment: 1 },
      correlationId,
    });
  }

  reassign(
    activity: ActivityRecord,
    input: ReassignActivityInput,
    teamId: string | null | undefined,
    correlationId: string,
  ): Promise<ActivityRecord | null> {
    return this.updateWithVersion(activity.id, input.version, {
      ownerUserId: input.ownerUserId,
      teamId,
      version: { increment: 1 },
      correlationId,
    });
  }

  cancel(
    activity: ActivityRecord,
    input: CancelActivityInput,
    correlationId: string,
  ): Promise<ActivityRecord | null> {
    return this.updateWithVersion(activity.id, input.version, {
      status: "CANCELED",
      canceledAt: new Date(),
      cancellationReason: input.reason,
      version: { increment: 1 },
      correlationId,
    });
  }

  updateFollowUpStatus(
    activity: ActivityRecord,
    input: UpdateFollowUpStatusInput,
    actorUserId: string,
    correlationId: string,
  ): Promise<ActivityRecord | null> {
    const status: ActivityStatus = input.status === "CANCELLED" ? "CANCELED" : input.status;
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.activity.updateMany({
        where: { id: activity.id, version: input.version },
        data: {
          status,
          completedAt:
            input.status === "COMPLETED" ? new Date(input.completedAt ?? new Date()) : undefined,
          canceledAt: input.status === "CANCELLED" ? new Date() : undefined,
          cancellationReason: input.status === "CANCELLED" ? input.reason : undefined,
          outcome: input.status === "COMPLETED" ? input.outcome : activity.outcome,
          note: input.note ?? activity.note,
          version: { increment: 1 },
          correlationId,
        },
      });
      if (result.count !== 1) return null;
      await tx.leadHistoryEntry.create({
        data: {
          leadId: activity.leadId,
          entryType:
            input.status === "COMPLETED"
              ? "FOLLOW_UP_COMPLETED"
              : input.status === "CANCELLED"
                ? "ACTIVITY_CANCELED"
                : "FOLLOW_UP_STATUS_CHANGED",
          actorUserId,
          summary: "Follow-up status changed",
          metadata: {
            activityId: activity.id,
            fromStatus: activity.status,
            toStatus: input.status,
          },
          correlationId,
        },
      });
      return this.findById(activity.id);
    });
  }

  private async updateWithVersion(
    id: string,
    version: number,
    data: Prisma.ActivityUncheckedUpdateManyInput,
  ): Promise<ActivityRecord | null> {
    const result = await this.prisma.activity.updateMany({ where: { id, version }, data });
    if (result.count !== 1) return null;
    return this.findById(id);
  }

  private whereForDueState(dueState: ActivitySearchInput["dueState"]): Prisma.ActivityWhereInput {
    if (!dueState) return {};
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    if (dueState === "COMPLETED") return { status: "COMPLETED" };
    if (dueState === "CANCELED") return { status: "CANCELED" };
    if (dueState === "OVERDUE") return { status: "PLANNED", dueAt: { lt: startOfToday } };
    if (dueState === "DUE_TODAY") {
      return { status: "PLANNED", dueAt: { gte: startOfToday, lt: startOfTomorrow } };
    }
    return { status: "PLANNED", dueAt: { gte: startOfTomorrow } };
  }
}
