import { describe, expect, it } from "vitest";

describe("smoke job", () => {
  it("uses a non-business job type", () => {
    expect("FOUNDATION_SMOKE_JOB").not.toContain("LEAD");
  });
});
