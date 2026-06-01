import { afterEach, describe, expect, it, vi } from "vitest";
import { getFoundationStatus } from "../features/foundation/api/foundation-status";

describe("getFoundationStatus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns readiness status from the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "UP", correlationId: "test-correlation-id" }),
      }),
    );

    await expect(getFoundationStatus()).resolves.toEqual({
      status: "UP",
      correlationId: "test-correlation-id",
    });
  });

  it("fails closed when the readiness call fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));

    await expect(getFoundationStatus()).resolves.toEqual({ status: "DOWN" });
  });
});
