import { describe, expect, it } from "vitest";
import { envSchema } from "../../src/config/env.schema.js";

const validEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5433/db",
  REDIS_URL: "redis://localhost:6379",
  SESSION_SECRET: "replace-with-at-least-32-characters",
  SEEDED_ADMIN_EMAIL: "admin@example.com",
  SEEDED_ADMIN_PASSWORD: "ChangeThisPassword123!",
};

describe("envSchema", () => {
  it("accepts the required foundation environment", () => {
    expect(envSchema.safeParse(validEnv).success).toBe(true);
  });

  it("rejects short session secrets", () => {
    expect(envSchema.safeParse({ ...validEnv, SESSION_SECRET: "short" }).success).toBe(false);
  });
});
