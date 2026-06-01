import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const contract = readFileSync(join(process.cwd(), "../../packages/contracts/openapi.yaml"), "utf8");

describe("leads assignment contract", () => {
  it("documents the lead assignment endpoint and request schema", () => {
    expect(contract).toContain("/leads/{leadId}/assignment:");
    expect(contract).toContain("AssignLeadRequest");
    expect(contract).toContain("Lead assignment updated");
    expect(contract).toContain("StaleUpdate");
  });
});
