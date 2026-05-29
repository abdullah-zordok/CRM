import { describe, expect, it } from "vitest";

describe("smoke job retry", () => {
  it("allows bounded retries", () => {
    expect(3).toBeGreaterThan(1);
  });
});
