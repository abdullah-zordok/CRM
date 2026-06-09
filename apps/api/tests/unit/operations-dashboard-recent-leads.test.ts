import { describe, expect, it, vi } from "vitest";
import { OperationsDashboardRepository } from "../../src/modules/dashboards/operations-dashboard.repository.js";

describe("OperationsDashboardRepository lead-focused overview", () => {
  it("returns summary, created lead counts, and paginated creator/owner rows", async () => {
    const creator = { id: "creator-1", displayName: "Abdullah" };
    const owner = { id: "owner-2", displayName: "Mohamed" };
    const lead = {
      id: "lead-1",
      displayName: "Ahmed",
      phone: "+15551234567",
      email: "ahmed@example.com",
      status: "NEW",
      createdAt: new Date("2026-06-03T10:00:00.000Z"),
      creator,
      owner,
    };
    const count = vi.fn().mockResolvedValueOnce(2).mockResolvedValueOnce(1);
    const prisma = {
      $transaction: async (items: Promise<unknown>[]) => Promise.all(items),
      lead: {
        count,
        findMany: vi.fn().mockResolvedValue([lead]),
        groupBy: vi.fn().mockResolvedValue([{ createdByUserId: creator.id, _count: 2 }]),
      },
      platformUser: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: creator.id,
            displayName: creator.displayName,
            email: "abdullah@example.com",
            roleAssignments: [{ roleCode: "SALES_REPRESENTATIVE", status: "ACTIVE" }],
          },
          {
            id: owner.id,
            displayName: owner.displayName,
            email: "mohamed@example.com",
            roleAssignments: [{ roleCode: "MANAGER", status: "ACTIVE" }],
          },
        ]),
      },
    };
    const repository = new OperationsDashboardRepository(prisma as never);

    await expect(
      repository.overview({
        leadWhere: {},
        userWhere: { status: "ACTIVE", isDeleted: false },
        query: { page: 1, pageSize: 10 },
      }),
    ).resolves.toMatchObject({
      summary: {
        totalLeads: 2,
        totalUsers: 2,
        salesRepresentatives: 1,
      },
      usersOverview: [
        {
          id: creator.id,
          displayName: creator.displayName,
          leadCount: 2,
        },
        {
          id: owner.id,
          displayName: owner.displayName,
          leadCount: 0,
        },
      ],
      leads: [
        {
          id: "lead-1",
          name: "Ahmed",
          createdBy: creator,
          currentOwner: owner,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });
});
