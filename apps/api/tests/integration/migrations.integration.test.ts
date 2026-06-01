import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("migrations", () => {
  it("has a single ordered init migration for the current schema snapshot", () => {
    const migrationsDir = join(process.cwd(), "prisma", "migrations");
    const migrations = readdirSync(migrationsDir).filter((entry) => entry !== "README.md");

    expect(migrations).toEqual([...migrations].sort());
    expect(migrations).toContain("20260528224159_init");
  });
});
