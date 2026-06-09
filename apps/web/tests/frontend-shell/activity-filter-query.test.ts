import { describe, expect, it } from "vitest";
import { serializeActivitySearchQuery } from "../../features/activities/api/activities-client";

describe("activity filter query serialization", () => {
  it("serializes defined filters only", () => {
    expect(
      serializeActivitySearchQuery({
        ownerUserId: "owner-1",
        type: "CALL",
        dueState: "OVERDUE",
        page: 2,
      }),
    ).toBe("ownerUserId=owner-1&type=CALL&dueState=OVERDUE&page=2");
  });
});
