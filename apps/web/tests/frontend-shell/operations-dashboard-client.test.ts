import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOperationsDashboard } from "../../features/workspace/api/operations-dashboard-client";

describe("getOperationsDashboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the lead-first dashboard with query parameters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        scope: "MANAGER_TEAM",
        summary: { totalLeads: 1, totalUsers: 2, salesRepresentatives: 1 },
        usersOverview: [],
        leads: [],
        pagination: { page: 2, pageSize: 10, total: 12, totalPages: 2 },
        generatedAt: "2026-06-03T10:01:00.000Z",
      }),
    } as Response);

    await expect(
      getOperationsDashboard({ search: "ahmed", status: "NEW", page: 2, pageSize: 10 }),
    ).resolves.toMatchObject({
      summary: { totalLeads: 1, totalUsers: 2, salesRepresentatives: 1 },
      pagination: { page: 2, totalPages: 2 },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3101/dashboard/operations?search=ahmed&status=NEW&page=2&pageSize=10",
      expect.objectContaining({ credentials: "include" }),
    );
  });
});
