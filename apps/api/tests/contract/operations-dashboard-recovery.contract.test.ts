import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("operations dashboard recovery contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents scoped operational metrics", () => {
    expect(contract).toContain("/dashboard/operations:");
    expect(contract).toContain("ADMIN_GLOBAL");
    expect(contract).toContain("MANAGER_TEAM");
    expect(contract).toContain("DashboardSummary");
    expect(contract).toContain("usersOverview");
    expect(contract).toContain("DashboardUserOverview");
    expect(contract).toContain("DashboardLead");
    expect(contract).toContain("pagination");
    expect(contract).toContain("totalUsers");
    expect(contract).toContain("salesRepresentatives");
    expect(contract).toContain("leadCount");
    expect(contract).toContain("createdBy");
    expect(contract).toContain("currentOwner");
    expect(contract).not.toContain("recentLeads");
    expect(contract).not.toContain("activityStatistics");
    expect(contract).not.toContain("followUpStatistics");
    expect(contract).not.toContain("RepresentativeMetric");
  });
});
