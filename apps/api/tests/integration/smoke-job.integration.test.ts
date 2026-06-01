import { describe, expect, it } from "vitest";
import { BackgroundJobStatus } from "@prisma/client";
import { createSmokeJob } from "../../../../packages/test-utils/src/foundation-factories.js";

describe("smoke job", () => {
  it("uses a non-business job type and known statuses", () => {
    const job = createSmokeJob();

    expect(job.jobType).toBe("FOUNDATION_SMOKE_JOB");
    expect(job.jobType).not.toContain("LEAD");
    expect(Object.values(BackgroundJobStatus)).toContain(job.status);
  });
});
