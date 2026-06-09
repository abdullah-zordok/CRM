import { describe, expect, it } from "vitest";
import { loadOpenApiContract } from "../../../../packages/test-utils/src/openapi-contract.js";

describe("login-ready user contract", () => {
  it("requires Admin-created users to include initial credentials", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");
    const schemas = (contract as { components?: { schemas?: Record<string, unknown> } }).components
      ?.schemas;

    expect(contract.paths["/users"]?.post).toBeDefined();
    expect(JSON.stringify(schemas?.CreateUserRequest)).toContain("password");
    expect(JSON.stringify(schemas?.CreateUserRequest)).toContain("ACTIVE");
  });

  it("documents login while keeping credential fields out of user responses", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");
    const schemas = (contract as { components?: { schemas?: Record<string, unknown> } }).components
      ?.schemas;

    expect(contract.paths["/auth/login"]?.post).toBeDefined();
    expect(JSON.stringify(schemas?.UserDetail)).not.toContain("password");
    expect(JSON.stringify(schemas?.UserDetail)).not.toContain("passwordHash");
  });
});
