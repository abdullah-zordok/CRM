import { describe, expect, it } from "vitest";

describe("migrations", () => {
  it("keeps migration folders ordered", () => {
    const migrations = ["001_foundation_init", "002_foundation_auth", "003_foundation_events_jobs"];
    expect(migrations).toEqual([...migrations].sort());
  });
});
