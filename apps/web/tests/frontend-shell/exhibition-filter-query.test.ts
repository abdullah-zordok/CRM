import { afterEach, describe, expect, it, vi } from "vitest";
import { searchExhibitions } from "../../features/exhibitions/api/exhibitions-client";

describe("exhibition filter query serialization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("serializes defined filters only", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [], total: 0, page: 1, pageSize: 25 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await searchExhibitions({
      search: "expo",
      status: "PLANNED",
      location: "",
      page: 2,
      pageSize: 50,
    });

    const [url] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain("/exhibitions?");
    expect(String(url)).toContain("search=expo");
    expect(String(url)).toContain("status=PLANNED");
    expect(String(url)).toContain("page=2");
    expect(String(url)).toContain("pageSize=50");
    expect(String(url)).not.toContain("location=");
  });
});
