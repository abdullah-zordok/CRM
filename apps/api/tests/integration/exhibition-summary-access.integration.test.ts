import { describe, expect, it } from "vitest";
import {
  PERMISSION_MATRIX,
  PermissionCode,
} from "../../src/modules/users/permissions/permission-codes.js";

describe("exhibition summary access integration", () => {
  it("limits summary review permission to Admin and Manager roles", () => {
    const permission = PERMISSION_MATRIX.find(
      (item) => item.code === PermissionCode.ExhibitionsViewSummary,
    );

    expect(permission?.grantedTo).toEqual(["ADMIN", "MANAGER"]);
  });
});
