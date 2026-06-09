import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("users lifecycle recovery contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("documents status update and soft delete conflict responses", () => {
    expect(contract).toContain("/users/{userId}:");
    expect(contract).toContain("patch:");
    expect(contract).toContain("delete:");
    expect(contract).toContain("SELF_ACTION_BLOCKED");
    expect(contract).toContain("LAST_ACTIVE_ADMIN_BLOCKED");
  });
});
