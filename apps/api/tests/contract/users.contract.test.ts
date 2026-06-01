import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Users contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines user and activation endpoints", () => {
    expect(contract).toContain("/users:");
    expect(contract).toContain("/users/{userId}:");
    expect(contract).toContain("/activation/complete:");
  });
});
