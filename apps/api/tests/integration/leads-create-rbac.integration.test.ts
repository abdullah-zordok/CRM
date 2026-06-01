import { describe, expect, it } from "vitest";
import { LeadAccessService } from "../../src/modules/leads/permissions/lead-access.service.js";

describe("lead create RBAC", () => {
  it("denies anonymous lead access by default", () => {
    const service = Object.create(LeadAccessService.prototype) as LeadAccessService;
    expect(service.evaluate(undefined, undefined, "CREATE")).toEqual({
      allowed: false,
      scope: "NONE",
      reason: "USER_INACTIVE",
    });
  });
});
