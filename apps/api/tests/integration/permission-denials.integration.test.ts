import { describe, expect, it } from "vitest";
import { PermissionCode } from "../../src/modules/users/permissions/permission-codes.js";
import { PermissionService } from "../../src/modules/users/permissions/permission.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("permission denials", () => {
  it("records default-deny access decisions", async () => {
    const repo = new UsersRepository();
    const permissions = new PermissionService(repo);
    await permissions.can(undefined, PermissionCode.UsersManage);
    expect(repo.accessDecisions[0]?.decision).toBe("DENY");
  });
});
