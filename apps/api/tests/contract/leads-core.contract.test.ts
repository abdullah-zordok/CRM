import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Leads Core contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines lead core endpoints", () => {
    expect(contract).toContain("/leads:");
    expect(contract).toContain("/leads/{leadId}:");
    expect(contract).toContain("/leads/{leadId}/assignment:");
    expect(contract).toContain("/leads/{leadId}/status:");
    expect(contract).toContain("/leads/{leadId}/notes:");
    expect(contract).toContain("/leads/{leadId}/history:");
    expect(contract).toContain("/leads/sources:");
  });
});
