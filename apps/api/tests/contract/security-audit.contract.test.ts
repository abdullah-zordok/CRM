import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Security audit contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines searchable security audit endpoint", () => {
    expect(contract).toContain("/audit/security:");
    expect(contract).toContain("AuditSearchResponse");
  });
});
