import { describe, expect, it } from "vitest";
import { createSmokeJob } from "../../../../packages/test-utils/src/foundation-factories.js";

describe("smoke job retry", () => {
  it("allows bounded retries", () => {
    const job = createSmokeJob();

    expect(job.maxAttempts).toBe(3);
    expect(job.attempts).toBeLessThan(job.maxAttempts);
  });
});
