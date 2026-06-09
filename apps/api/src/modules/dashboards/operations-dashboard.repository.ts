import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../infrastructure/database/prisma.service.js";
import type { OperationsDashboardQueryInput } from "./operations-dashboard.schemas.js";

@Injectable()
export class OperationsDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async overview(input: {
    leadWhere: Prisma.LeadWhereInput;
    userWhere: Prisma.PlatformUserWhereInput;
    query: OperationsDashboardQueryInput;
  }) {
    const leadFilters = this.leadFilters(input.query);
    const filteredLeadWhere: Prisma.LeadWhereInput = {
      AND: [input.leadWhere, ...leadFilters],
    };

    const [totalLeads, users, leads, filteredTotal] = await this.prisma.$transaction([
      this.prisma.lead.count({ where: input.leadWhere }),
      this.prisma.platformUser.findMany({
        where: input.userWhere,
        include: {
          roleAssignments: true,
        },
        orderBy: { displayName: "asc" },
      }),
      this.prisma.lead.findMany({
        where: filteredLeadWhere,
        select: {
          id: true,
          displayName: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              displayName: true,
            },
          },
          owner: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (input.query.page - 1) * input.query.pageSize,
        take: input.query.pageSize,
      }),
      this.prisma.lead.count({ where: filteredLeadWhere }),
    ]);

    const userIds = users.map((user) => user.id);
    const leadCounts =
      userIds.length === 0
        ? []
        : await this.prisma.lead.groupBy({
            by: ["createdByUserId"],
            where: {
              AND: [input.leadWhere, { createdByUserId: { in: userIds } }],
            },
            _count: true,
          });
    const leadCountByUser = new Map(
      leadCounts.map((item) => [item.createdByUserId, item._count] as const),
    );

    const usersOverview = users
      .map((user) => ({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        leadCount: leadCountByUser.get(user.id) ?? 0,
      }))
      .sort(
        (a, b) =>
          b.leadCount - a.leadCount ||
          a.displayName.localeCompare(b.displayName, "en", { sensitivity: "base" }),
      );

    return {
      summary: {
        totalLeads,
        totalUsers: users.length,
        salesRepresentatives: users.filter((user) =>
          user.roleAssignments.some(
            (assignment) =>
              assignment.roleCode === "SALES_REPRESENTATIVE" && assignment.status === "ACTIVE",
          ),
        ).length,
      },
      usersOverview,
      leads: leads.map((lead) => ({
        id: lead.id,
        name: lead.displayName,
        phone: lead.phone,
        email: lead.email,
        createdBy: {
          id: lead.creator.id,
          displayName: lead.creator.displayName,
        },
        currentOwner: {
          id: lead.owner.id,
          displayName: lead.owner.displayName,
        },
        createdAt: lead.createdAt.toISOString(),
        status: lead.status,
      })),
      pagination: {
        page: input.query.page,
        pageSize: input.query.pageSize,
        total: filteredTotal,
        totalPages: Math.max(1, Math.ceil(filteredTotal / input.query.pageSize)),
      },
    };
  }

  private leadFilters(query: OperationsDashboardQueryInput): Prisma.LeadWhereInput[] {
    return [
      query.status ? { status: query.status } : {},
      query.search
        ? {
            OR: [
              { displayName: { contains: query.search, mode: "insensitive" } },
              { company: { contains: query.search, mode: "insensitive" } },
              { email: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {},
    ];
  }
}
