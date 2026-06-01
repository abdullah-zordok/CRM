import { describe, expect, it } from "vitest";
import { leadSearchSchema } from "../../src/modules/leads/leads.schemas.js";

describe("lead search scale query validation", () => {
  it("bounds pagination for 10000 active lead validation", () => {
    expect(leadSearchSchema.parse({ page: "1", pageSize: "100" })).toMatchObject({
      page: 1,
      pageSize: 100,
    });
    expect(() => leadSearchSchema.parse({ page: "1", pageSize: "101" })).toThrow();
  });
});
