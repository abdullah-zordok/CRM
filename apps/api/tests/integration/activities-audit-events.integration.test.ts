import { describe, expect, it } from "vitest";
import { ACTIVITY_DOMAIN_EVENTS } from "../../src/modules/leads/activities/activity.types.js";

describe("activities audit and event contract", () => {
  it("declares the ActivityCreated domain event", () => {
    expect(ACTIVITY_DOMAIN_EVENTS).toContain("ActivityCreated");
  });
});
