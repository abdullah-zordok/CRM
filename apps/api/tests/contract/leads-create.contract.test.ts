import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Leads create/list contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents create, list, detail, and sources endpoints", () => {
    expect(contract).toContain("/leads:");
    expect(contract).toContain("post:");
    expect(contract).toContain("get:");
    expect(contract).toContain("/leads/{leadId}:");
    expect(contract).toContain("/leads/sources:");
  });
});
