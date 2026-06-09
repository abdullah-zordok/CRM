import "reflect-metadata";
import { type CanActivate, type ExecutionContext } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleGuard } from "../../src/common/guards/role.guard.js";
import { SessionGuard } from "../../src/common/guards/session.guard.js";
import { RolesController } from "../../src/modules/users/permissions/roles.controller.js";
import { ReviewerAccessService } from "../../src/modules/users/permissions/reviewer-access.service.js";
import { RoleAssignmentService } from "../../src/modules/users/permissions/role-assignment.service.js";

const userRecord = {
  id: "user-1",
  email: "rep@example.com",
  displayName: "Rep",
  status: "ACTIVE",
  isDeleted: false,
  roles: ["MANAGER"],
  hasReviewerAccess: false,
  createdAt: new Date("2026-06-03T10:00:00.000Z"),
  updatedAt: new Date("2026-06-03T10:00:00.000Z"),
};

describe("RolesController validation", () => {
  const replaceRoles = vi.fn();
  const setReviewerAccess = vi.fn();

  beforeEach(() => {
    replaceRoles.mockReset();
    setReviewerAccess.mockReset();
    replaceRoles.mockResolvedValue(userRecord);
    setReviewerAccess.mockResolvedValue(userRecord);
  });

  async function createApp() {
    const sessionGuard: CanActivate = {
      canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        request.user = { id: "admin-1", roles: ["ADMIN"], status: "ACTIVE" };
        return true;
      },
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RoleAssignmentService, useValue: { replaceRoles } },
        { provide: ReviewerAccessService, useValue: { setReviewerAccess } },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue(sessionGuard)
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();
    const app = moduleRef.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return app;
  }

  it("validates only the roles request body, not the route param", async () => {
    const app = await createApp();

    await request(app.getHttpServer())
      .put("/users/user-1/roles")
      .send({ roles: ["MANAGER"] })
      .expect(200);

    expect(replaceRoles).toHaveBeenCalledWith("user-1", ["MANAGER"], "admin-1");
    await app.close();
  });

  it("still rejects invalid role update bodies", async () => {
    const app = await createApp();

    await request(app.getHttpServer())
      .put("/users/user-1/roles")
      .send({ roles: ["INVALID_ROLE"] })
      .expect(400);

    expect(replaceRoles).not.toHaveBeenCalled();
    await app.close();
  });
});
