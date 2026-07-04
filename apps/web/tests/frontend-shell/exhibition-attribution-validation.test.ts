import { afterEach, describe, expect, it, vi } from "vitest";
import {
  attributeLead,
  correctAttribution,
} from "../../features/exhibitions/api/exhibitions-client";

describe("exhibition attribution client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts attribution and correction payloads", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await attributeLead("exhibition-1", {
      leadId: "lead-1",
      attributionType: "SOURCE",
      preserveReference: true,
    });
    await correctAttribution("exhibition-1", "attribution-1", {
      status: "REMOVED",
      correctionReason: "Wrong event",
      version: 3,
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/exhibitions/exhibition-1/lead-attributions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          leadId: "lead-1",
          attributionType: "SOURCE",
          preserveReference: true,
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/exhibitions/exhibition-1/lead-attributions/attribution-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          status: "REMOVED",
          correctionReason: "Wrong event",
          version: 3,
        }),
      }),
    );
  });
});
