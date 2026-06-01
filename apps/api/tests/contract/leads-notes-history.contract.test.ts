import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("leads notes and history contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents append-only notes and lead history endpoints", () => {
    expect(contract).toContain("/leads/{leadId}/notes:");
    expect(contract).toContain("/leads/{leadId}/history:");
    expect(contract).toContain("AddLeadNoteRequest:");
    expect(contract).toContain("LeadHistoryResponse:");
    expect(contract).toContain("LeadNote:");
  });
});
