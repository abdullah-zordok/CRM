import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Users RBAC contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines roles and permission matrix endpoints", () => {
    expect(contract).toContain("/users/{userId}/roles:");
    expect(contract).toContain("/users/{userId}/reviewer-access:");
    expect(contract).toContain("/permissions/matrix:");
  });
});
