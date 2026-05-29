import { describe, expect, it } from "vitest";
import { loadOpenApiContract } from "../../../../packages/test-utils/src/openapi-contract.js";

describe("foundation smoke contract", () => {
  it("documents smoke event and job status endpoints", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");
    expect(contract.paths["/foundation/smoke-events"]?.post).toBeDefined();
    expect(contract.paths["/foundation/jobs/{jobId}"]?.get).toBeDefined();
  });
});
