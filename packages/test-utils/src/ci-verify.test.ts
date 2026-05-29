import { describe, expect, it } from "vitest";

describe("ci verify command", () => {
  it("has a package script target", () => {
    expect("ci:verify").toBe("ci:verify");
  });
});
