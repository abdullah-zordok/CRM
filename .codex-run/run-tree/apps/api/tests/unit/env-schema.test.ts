import { describe, expect, it } from "vitest";
import { envSchema } from "../../src/config/env.schema.js";

describe("envSchema", () => {
  it("rejects short session secrets", () => {
    const result = envSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      REDIS_URL: "redis://localhost:6379",
      SESSION_SECRET: "short",
      SEEDED_ADMIN_EMAIL: "admin@example.com",
      SEEDED_ADMIN_PASSWORD: "ChangeThisPassword123!",
    });
    expect(result.success).toBe(false);
  });
});
