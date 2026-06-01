import { describe, expect, it } from "vitest";
import { foundationSmokeEventName } from "../../src/infrastructure/events/event-types.js";

describe("operational event", () => {
  it("uses a foundation-only smoke event name", () => {
    expect(foundationSmokeEventName).toBe("FoundationSmokeRequested");
    expect(foundationSmokeEventName.toLowerCase()).not.toContain("lead");
    expect(foundationSmokeEventName.toLowerCase()).not.toContain("deal");
  });
});
