import { describe, expect, it } from "vitest";
import { loadOpenApiContract } from "../../../../packages/test-utils/src/openapi-contract.js";

describe("auth contract", () => {
  it("documents authentication and protected shell endpoints", async () => {
    const contract = await loadOpenApiContract("../../packages/contracts/openapi.yaml");
    expect(contract.paths["/auth/login"]?.post).toBeDefined();
    expect(contract.paths["/auth/logout"]?.post).toBeDefined();
    expect(contract.paths["/auth/me"]?.get).toBeDefined();
    expect(contract.paths["/foundation/protected-shell/access"]?.get).toBeDefined();
  });
});
