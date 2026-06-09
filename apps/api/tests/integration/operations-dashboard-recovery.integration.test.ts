import { describe, expect, it } from "vitest";
import { OperationsDashboardService } from "../../src/modules/dashboards/operations-dashboard.service.js";

describe("operations dashboard recovery integration", () => {
  it("returns Manager team scoped empty metrics", async () => {
    const service = new OperationsDashboardService(
      {
        overview: async () => ({
          summary: { totalLeads: 0, totalUsers: 0, salesRepresentatives: 0 },
          usersOverview: [],
          leads: [],
          pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
        }),
      } as never,
      { record: async () => undefined } as never,
      { record: () => undefined } as never,
    );

    await expect(
      service.getOperations(
        {
          id: "manager-1",
          email: "manager@example.com",
          displayName: "Manager",
          status: "ACTIVE",
          isDeleted: false,
          sessionId: "session-1",
          roles: ["MANAGER"],
          hasReviewerAccess: false,
          activeTeam: { id: "team-1", name: "Team 1", status: "ACTIVE" },
        },
        { page: 1, pageSize: 10 },
      ),
    ).resolves.toMatchObject({
      scope: "MANAGER_TEAM",
      summary: { totalLeads: 0, totalUsers: 0, salesRepresentatives: 0 },
      usersOverview: [],
      leads: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
    });
  });
});
