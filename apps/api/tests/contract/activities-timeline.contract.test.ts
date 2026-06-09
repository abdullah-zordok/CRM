import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Activities Timeline contract", () => {
  const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

  it("defines activity timeline endpoints", () => {
    expect(contract).toContain("/activities:");
    expect(contract).toContain("/leads/{leadId}/activities:");
    expect(contract).toContain("/activities/{activityId}/complete:");
    expect(contract).toContain("/activities/{activityId}/reassign:");
    expect(contract).toContain("/activities/{activityId}/cancel:");
    expect(contract).toContain("/activities/{activityId}/follow-up-status:");
  });

  it("defines activity request and response schemas", () => {
    expect(contract).toContain("CreateActivityRequest:");
    expect(contract).toContain("ActivityDetail:");
    expect(contract).toContain("ActivityListResponse:");
    expect(contract).toContain("ActivityTimelineResponse:");
    expect(contract).toContain("ActivityKind:");
    expect(contract).toContain("FollowUpStatus:");
    expect(contract).toContain("UpdateFollowUpStatusRequest:");
    expect(contract).toContain("IN_PROGRESS");
    expect(contract).toContain("recordedByDisplayName");
    expect(contract).toContain("ownerDisplayName");
  });
});
