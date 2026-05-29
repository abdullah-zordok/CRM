import { describe, expect, it } from "vitest";

describe("foundation web test harness", () => {
  it("loads the foundation test environment", () => {
    expect("foundation").toBe("foundation");
  });
});
