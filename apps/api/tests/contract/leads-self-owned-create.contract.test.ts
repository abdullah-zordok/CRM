import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("self-owned lead create contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents representative self-owned lead creation fields", () => {
    expect(contract).toContain("/leads:");
    expect(contract).toContain("post:");
    expect(contract).toContain("ownerUserId");
    expect(contract).toContain("createdByUserId");
    expect(contract).toContain("ownerDisplayName");
    expect(contract).toContain("createdByDisplayName");
  });
});
