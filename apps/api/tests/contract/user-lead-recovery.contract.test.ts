import { describe, expect, it } from "vitest";
import { loadOpenApiContract } from "../../../../packages/test-utils/src/openapi-contract.js";

describe("User and Lead Recovery contract", () => {
  it("documents recovery endpoints in the shared OpenAPI contract", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");

    expect(contract.paths["/auth/login"]?.post).toBeDefined();
    expect(contract.paths["/users"]?.post).toBeDefined();
    expect(contract.paths["/users/{userId}"]?.patch).toBeDefined();
    expect(contract.paths["/users/{userId}"]?.delete).toBeDefined();
    expect(contract.paths["/leads"]?.get).toBeDefined();
    expect(contract.paths["/leads"]?.post).toBeDefined();
    expect(contract.paths["/leads/{leadId}"]?.get).toBeDefined();
    expect(contract.paths["/dashboard/operations"]?.get).toBeDefined();
  });

  it("keeps credentials write-only and exposes recovery attribution fields", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");
    const schemas = (contract as { components?: { schemas?: Record<string, unknown> } }).components
      ?.schemas;

    expect(JSON.stringify(schemas?.CreateUserRequest)).toContain("password");
    expect(JSON.stringify(schemas?.UserDetail)).not.toContain("passwordHash");
    expect(JSON.stringify(schemas?.UserDetail)).not.toContain("password");
    expect(JSON.stringify(schemas?.UserDetail)).toContain("isDeleted");
    expect(JSON.stringify(schemas?.LeadSummary)).toContain("ownerUserId");
    expect(JSON.stringify(schemas?.LeadSummary)).toContain("createdByUserId");
    expect(JSON.stringify(schemas?.OperationalDashboardResponse)).toContain("usersOverview");
    expect(JSON.stringify(schemas?.OperationalDashboardResponse)).toContain("summary");
    expect(JSON.stringify(schemas?.OperationalDashboardResponse)).toContain("leads");
  });
});
