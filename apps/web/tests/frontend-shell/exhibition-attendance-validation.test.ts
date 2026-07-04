import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assignAttendee,
  confirmAttendance,
} from "../../features/exhibitions/api/exhibitions-client";

describe("exhibition attendance client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts attendee assignment and confirmation payloads", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await assignAttendee("exhibition-1", { userId: "user-1", plannedRole: "Presenter" });
    await confirmAttendance("exhibition-1", "attendee-1", { status: "CONFIRMED", version: 2 });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3501/exhibitions/exhibition-1/attendees",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: "user-1", plannedRole: "Presenter" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3501/exhibitions/exhibition-1/attendees/attendee-1/confirm",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ status: "CONFIRMED", version: 2 }),
      }),
    );
  });
});
