import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("leads status contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents status updates and filtered lead search", () => {
    expect(contract).toContain("/leads/{leadId}/status:");
    expect(contract).toContain("ChangeLeadStatusRequest:");
    expect(contract).toContain("LeadStatus:");
    expect(contract).toContain("LeadStatusHistory:");
    expect(contract).toContain("name: status");
  });
});
