import { randomUUID } from "node:crypto";

export function createCorrelationId() {
  return randomUUID();
}

export function createFoundationUser(
  overrides: Partial<{ email: string; displayName: string }> = {},
) {
  return {
    id: randomUUID(),
    email: overrides.email ?? "admin@example.com",
    displayName: overrides.displayName ?? "Seeded Admin",
    roles: ["ADMIN"],
  };
}

export function createSmokeJob(overrides: Partial<{ status: string }> = {}) {
  return {
    jobId: randomUUID(),
    jobType: "FOUNDATION_SMOKE_JOB",
    status: overrides.status ?? "QUEUED",
    attempts: 0,
    maxAttempts: 3,
    correlationId: randomUUID(),
  };
}
