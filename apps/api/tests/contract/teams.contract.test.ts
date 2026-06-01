import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Teams contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines team endpoints", () => {
    expect(contract).toContain("/teams:");
    expect(contract).toContain("/teams/{teamId}:");
    expect(contract).toContain("/teams/{teamId}/members:");
  });
});
