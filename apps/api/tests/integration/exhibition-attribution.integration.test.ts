import { describe, expect, it } from "vitest";
import {
  AttributeLeadSchema,
  CorrectAttributionSchema,
} from "../../src/modules/exhibitions/exhibition.schemas.js";

const uuid = "00000000-0000-4000-8000-000000000001";

describe("exhibition attribution integration contract", () => {
  it("accepts lead attribution and correction commands", () => {
    expect(
      AttributeLeadSchema.safeParse({
        leadId: uuid,
        attributionType: "SOURCE",
        preserveReference: true,
      }).success,
    ).toBe(true);
    expect(
      CorrectAttributionSchema.safeParse({
        status: "REMOVED",
        correctionReason: "Wrong exhibition",
        version: 1,
      }).success,
    ).toBe(true);
  });
});
