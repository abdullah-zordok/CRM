import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contract = readFileSync("../../packages/contracts/openapi.yaml", "utf8");

describe("Exhibitions Module API contract", () => {
  it("documents exhibition management endpoints", () => {
    expect(contract).toContain("/exhibitions:");
    expect(contract).toContain("/exhibitions/{exhibitionId}:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/archive:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/restore:");
  });

  it("documents attendance, attribution, and summary endpoints", () => {
    expect(contract).toContain("/exhibitions/{exhibitionId}/attendees:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/attendees/{attendeeId}/confirm:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/lead-attributions:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/lead-attributions/{attributionId}:");
    expect(contract).toContain("/exhibitions/{exhibitionId}/summary:");
  });

  it("documents request and response schemas plus stale update errors", () => {
    expect(contract).toContain("CreateExhibitionRequest:");
    expect(contract).toContain("UpdateExhibitionRequest:");
    expect(contract).toContain("AssignExhibitionAttendeeRequest:");
    expect(contract).toContain("AttributeLeadRequest:");
    expect(contract).toContain("ExhibitionPerformanceSummary:");
    expect(contract).toContain("StaleUpdate");
  });
});
