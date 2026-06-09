import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("lead visibility recovery contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents scoped list and detail visibility fields", () => {
    expect(contract).toContain("/leads:");
    expect(contract).toContain("ownerUserId");
    expect(contract).toContain("teamId");
    expect(contract).toContain("/leads/{leadId}:");
    expect(contract).toContain("ownerDisplayName");
    expect(contract).toContain("createdByUserId");
    expect(contract).toContain("createdByDisplayName");
  });
});
