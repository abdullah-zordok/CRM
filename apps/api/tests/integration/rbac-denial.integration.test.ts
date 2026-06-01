import { describe, expect, it } from "vitest";
import { PermissionCode } from "../../src/modules/users/permissions/permission-codes.js";
import { PermissionService } from "../../src/modules/users/permissions/permission.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("rbac denial", () => {
  it("defaults protected access to denied when no user is authenticated", async () => {
    const repo = new UsersRepository();
    const permissions = new PermissionService(repo);

    expect(await permissions.can(undefined, PermissionCode.ProfileRead)).toBe(false);
    expect(repo.accessDecisions[0]?.reason).toBe("DEFAULT_DENY");
  });
});
