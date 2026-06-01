import { describe, expect, it } from "vitest";
import { PermissionCode } from "../../src/modules/users/permissions/permission-codes.js";
import { PermissionService } from "../../src/modules/users/permissions/permission.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("team scope RBAC", () => {
  it("denies Sales Representative team management", async () => {
    const repo = new UsersRepository();
    const rep = await repo.saveUser({
      id: repo.nextId(),
      email: "rep2@example.com",
      displayName: "Rep",
      status: "ACTIVE",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(await new PermissionService(repo).can(rep, PermissionCode.TeamsManage)).toBe(false);
  });
});
