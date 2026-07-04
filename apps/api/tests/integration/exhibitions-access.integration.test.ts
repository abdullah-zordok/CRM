import { describe, expect, it } from "vitest";
import { ExhibitionAccessService } from "../../src/modules/exhibitions/exhibition-access.service.js";
import {
  PERMISSION_MATRIX,
  PermissionCode,
} from "../../src/modules/users/permissions/permission-codes.js";

describe("exhibition access integration", () => {
  it("grants exhibition management permissions only to Admin and Manager roles", () => {
    const create = PERMISSION_MATRIX.find(
      (permission) => permission.code === PermissionCode.ExhibitionsCreate,
    );
    const assign = PERMISSION_MATRIX.find(
      (permission) => permission.code === PermissionCode.ExhibitionsAssignAttendee,
    );

    expect(create?.grantedTo).toEqual(["ADMIN", "MANAGER"]);
    expect(assign?.grantedTo).toEqual(["ADMIN", "MANAGER"]);
  });

  it("keeps sales representative mutation access default-denied outside attendee or owned lead scope", () => {
    const access = new ExhibitionAccessService({} as never);
    expect(
      access.evaluate(
        {
          id: "rep-1",
          email: "rep@example.com",
          displayName: "Rep",
          status: "ACTIVE",
          roles: ["SALES_REPRESENTATIVE"],
          hasReviewerAccess: false,
          sessionId: "session-1",
        },
        { ownerUserId: "owner-1", teamId: "team-1" },
        undefined,
        undefined,
        "UPDATE",
      ),
    ).toMatchObject({ allowed: false });
  });
});
