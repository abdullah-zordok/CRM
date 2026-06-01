import { describe, expect, it } from "vitest";
import { loadOpenApiContract } from "../../../../packages/test-utils/src/openapi-contract.js";

describe("health contract", () => {
  it("documents liveness and readiness endpoints", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");

    expect(contract.paths["/health/live"]?.get).toBeDefined();
    expect(contract.paths["/health/ready"]?.get).toBeDefined();
  });
});
