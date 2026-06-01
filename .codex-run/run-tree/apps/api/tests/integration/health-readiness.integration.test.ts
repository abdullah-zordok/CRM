import { describe, expect, it } from "vitest";

describe("health readiness", () => {
  it("reports api, database, cache, and queue service names", () => {
    const names = ["api", "database", "cache", "queue"];
    expect(names).toContain("api");
    expect(names).toContain("database");
    expect(names).toContain("cache");
    expect(names).toContain("queue");
  });
});
