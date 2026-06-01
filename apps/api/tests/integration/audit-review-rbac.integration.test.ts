import { describe, expect, it } from "vitest";
import { PermissionCode } from "../../src/modules/users/permissions/permission-codes.js";
import { PermissionService } from "../../src/modules/users/permissions/permission.service.js";
import { UsersRepository } from "../../src/modules/users/users.repository.js";

describe("audit review RBAC", () => {
  it("allows operations reviewer audit read only", async () => {
    const repo = new UsersRepository();
    const reviewer = await repo.saveUser({
      id: repo.nextId(),
      email: "review@example.com",
      displayName: "Reviewer",
      status: "ACTIVE",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const permissions = new PermissionService(repo);
    expect(await permissions.can(reviewer, PermissionCode.AuditRead)).toBe(true);
    expect(await permissions.can(reviewer, PermissionCode.UsersManage)).toBe(false);
  });
});
