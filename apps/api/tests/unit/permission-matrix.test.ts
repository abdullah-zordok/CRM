import { describe, expect, it } from "vitest";
import { PermissionCode } from "../../src/modules/users/permissions/permission-codes.js";
import { PermissionService } from "../../src/modules/users/permissions/permission.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("PermissionService", () => {
  it("allows Admin and denies Sales Representative for user management", async () => {
    const repo = new UsersRepository();
    const service = new PermissionService(repo);
    const admin = await repo.findUser("00000000-0000-4000-8000-000000000001");
    const sales = await repo.saveUser({
      id: repo.nextId(),
      email: "rep@example.com",
      displayName: "Rep",
      status: "ACTIVE",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(await service.can(admin, PermissionCode.UsersManage)).toBe(true);
    expect(await service.can(sales, PermissionCode.UsersManage)).toBe(false);
  });
});
