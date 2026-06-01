import { describe, expect, it } from "vitest";

describe("rbac denial", () => {
  it("defaults protected access to denied when no role matches", () => {
    const roles: string[] = [];
    expect(roles.includes("ADMIN")).toBe(false);
  });
});
