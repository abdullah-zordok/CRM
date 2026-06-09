import { ForbiddenException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { OperationsDashboardService } from "../../src/modules/dashboards/operations-dashboard.service.js";

describe("operations dashboard recovery rules", () => {
  it("denies Sales Representatives dashboard metrics", async () => {
    const scopes: unknown[] = [];
    const service = new OperationsDashboardService(
      {
        overview: async (scope: unknown) => {
          scopes.push(scope);
          return {
            summary: { totalLeads: 1, totalUsers: 1, salesRepresentatives: 1 },
            usersOverview: [],
            leads: [],
            pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
          };
        },
      } as never,
      { record: async () => undefined } as never,
      { record: () => undefined } as never,
    );

    await expect(
      service.getOperations(
        {
          id: "rep-1",
          email: "rep@example.com",
          displayName: "Rep",
          status: "ACTIVE",
          isDeleted: false,
          sessionId: "session-1",
          roles: ["SALES_REPRESENTATIVE"],
          hasReviewerAccess: false,
        },
        { page: 1, pageSize: 10 },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(scopes).toEqual([]);
  });
});
