import { describe, expect, it } from "vitest";
import { createCorrelationId } from "../../../../packages/test-utils/src/foundation-factories.js";

describe("observability", () => {
  it("creates correlation identifiers", () => {
    expect(createCorrelationId()).toHaveLength(36);
  });
});
