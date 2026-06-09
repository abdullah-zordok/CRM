import { describe, expect, it } from "vitest";
import { ExhibitionAccessService } from "../../src/modules/exhibitions/exhibition-access.service.js";

const service = new ExhibitionAccessService({} as never);

const activeUser = {
  id: "user-1",
  email: "user@example.com",
  displayName: "User",
  status: "ACTIVE",
  roles: [] as string[],
  hasReviewerAccess: false,
  sessionId: "session-1",
};

describe("exhibition access rules", () => {
  it("denies missing or inactive users by default", () => {
    expect(service.evaluate(undefined, undefined, undefined, undefined, "SEARCH")).toMatchObject({
      allowed: false,
      reason: "USER_INACTIVE",
    });
    expect(
      service.evaluate(
        { ...activeUser, status: "DISABLED", roles: ["ADMIN"] },
        undefined,
        undefined,
        undefined,
        "SEARCH",
      ),
    ).toMatchObject({ allowed: false });
  });

  it("allows admins globally", () => {
    expect(
      service.evaluate(
        { ...activeUser, roles: ["ADMIN"] },
        { ownerUserId: "owner-1", teamId: "team-2" },
        undefined,
        undefined,
        "UPDATE",
      ),
    ).toMatchObject({ allowed: true, scope: "GLOBAL" });
  });

  it("allows managers only in their team scope", () => {
    const manager = {
      ...activeUser,
      roles: ["MANAGER"],
      activeTeam: { id: "team-1", name: "North", status: "ACTIVE" },
    };

    expect(
      service.evaluate(
        manager,
        { ownerUserId: "owner-1", teamId: "team-1" },
        undefined,
        undefined,
        "VIEW",
      ),
    ).toMatchObject({ allowed: true, scope: "TEAM" });
    expect(
      service.evaluate(
        manager,
        { ownerUserId: "owner-1", teamId: "team-2" },
        undefined,
        undefined,
        "VIEW",
      ),
    ).toMatchObject({ allowed: false, reason: "DEFAULT_DENY" });
  });

  it("allows sales representatives through attendee or owned lead scope only", () => {
    const rep = { ...activeUser, roles: ["SALES_REPRESENTATIVE"] };

    expect(
      service.evaluate(rep, undefined, undefined, ["user-1"], "CONFIRM_ATTENDANCE"),
    ).toMatchObject({ allowed: true, scope: "ATTENDEE" });
    expect(
      service.evaluate(
        rep,
        { ownerUserId: "owner-1", teamId: null },
        { id: "lead-1", ownerUserId: "user-1", teamId: null },
        undefined,
        "ATTRIBUTE_LEAD",
      ),
    ).toMatchObject({ allowed: true, scope: "OWNED_LEAD" });
    expect(
      service.evaluate(
        rep,
        { ownerUserId: "owner-1", teamId: null },
        { id: "lead-1", ownerUserId: "other-user", teamId: null },
        undefined,
        "ATTRIBUTE_LEAD",
      ),
    ).toMatchObject({ allowed: false });
  });
});
