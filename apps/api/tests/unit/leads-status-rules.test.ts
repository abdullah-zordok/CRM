import { describe, expect, it } from "vitest";
import { resolveStatusChangeType } from "../../src/modules/leads/status/lead-status.service.js";

describe("lead status transition rules", () => {
  it("allows normal sales representative forward flow", () => {
    expect(
      resolveStatusChangeType({
        roles: ["SALES_REPRESENTATIVE"],
        fromStatus: "NEW",
        toStatus: "CONTACTED",
      }),
    ).toBe("NORMAL_FLOW");
  });

  it("rejects sales representative backward movement", () => {
    expect(
      resolveStatusChangeType({
        roles: ["SALES_REPRESENTATIVE"],
        fromStatus: "QUALIFIED",
        toStatus: "CONTACTED",
      }),
    ).toBeNull();
  });

  it("allows manager correction, archive, and restore paths", () => {
    expect(
      resolveStatusChangeType({
        roles: ["MANAGER"],
        fromStatus: "QUALIFIED",
        toStatus: "CONTACTED",
      }),
    ).toBe("CORRECTION");
    expect(
      resolveStatusChangeType({
        roles: ["MANAGER"],
        fromStatus: "LOST",
        toStatus: "ARCHIVED",
      }),
    ).toBe("ARCHIVE");
    expect(
      resolveStatusChangeType({
        roles: ["MANAGER"],
        fromStatus: "ARCHIVED",
        toStatus: "NEW",
      }),
    ).toBe("RESTORE");
  });
});
