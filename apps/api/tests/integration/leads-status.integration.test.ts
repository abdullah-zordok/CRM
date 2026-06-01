import { describe, expect, it } from "vitest";
import { resolveStatusChangeType } from "../../src/modules/leads/status/lead-status.service.js";

describe("lead status integration behavior", () => {
  it("classifies correction history and archive/restore events", () => {
    expect(
      resolveStatusChangeType({ roles: ["ADMIN"], fromStatus: "NEGOTIATION", toStatus: "NEW" }),
    ).toBe("CORRECTION");
    expect(
      resolveStatusChangeType({ roles: ["ADMIN"], fromStatus: "WON", toStatus: "ARCHIVED" }),
    ).toBe("ARCHIVE");
    expect(
      resolveStatusChangeType({ roles: ["ADMIN"], fromStatus: "ARCHIVED", toStatus: "CONTACTED" }),
    ).toBe("RESTORE");
  });
});
