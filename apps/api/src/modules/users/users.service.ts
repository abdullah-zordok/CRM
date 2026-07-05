import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ActivationService } from "./activation/activation.service.js";
import { AdminEventService } from "./admin-event.service.js";
import { toUserDetail, toUserSummary } from "./users.dto.js";
import { UsersRepository } from "./users.repository.js";
import type { CreateUserInput, UpdateUserInput } from "./users.schemas.js";
import type { PlatformUserRecord } from "./users.types.js";
import { UsersSecurityAuditService } from "./audit/users-security-audit.service.js";
import { PasswordService } from "../auth/security/password.service.js";

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly activation: ActivationService,
    private readonly audit: UsersSecurityAuditService,
    private readonly events: AdminEventService,
    private readonly passwords?: PasswordService,
  ) {}

  async list(
    query: {
      search?: string;
      role?: string;
      status?: string;
      teamId?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    let items = await this.repository.listUsers();
    if (query.search) {
      const search = query.search.toLowerCase();
      items = items.filter(
        (user) => user.email.includes(search) || user.displayName.toLowerCase().includes(search),
      );
    }
    if (query.role) items = items.filter((user) => user.roles.includes(query.role as never));
    if (query.status) items = items.filter((user) => user.status === query.status);
    if (query.teamId) items = items.filter((user) => user.activeTeam?.id === query.teamId);
    return {
      items: items.slice((page - 1) * pageSize, page * pageSize).map((user) => toUserSummary(user)),
      page,
      pageSize,
      total: items.length,
      correlationId: "local",
    };
  }

  async detail(userId: string) {
    return toUserDetail(await this.requireUser(userId));
  }

  async create(input: CreateUserInput, actorUserId = "system") {
    if (await this.repository.findUserByEmail(input.email))
      throw new ConflictException("Email already exists");
    const now = new Date();
    const passwordHash = input.password ? await this.passwords?.hash(input.password) : undefined;
    const user: PlatformUserRecord = {
      id: this.repository.nextId(),
      email: input.email,
      displayName: input.displayName,
      passwordHash,
      status: passwordHash ? "ACTIVE" : input.status,
      isDeleted: false,
      roles: [...new Set(input.roles)],
      hasReviewerAccess: input.reviewerAccess,
      activatedAt: passwordHash ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };
    await this.repository.saveUser(user);
    const activation = passwordHash ? undefined : await this.activation.issue(user.id, actorUserId);
    await this.audit.record({
      eventType: "USER_CREATED",
      actorUserId,
      targetUserId: user.id,
      resource: "users",
      metadata: { roles: user.roles, activationToken: activation?.rawToken },
    });
    this.events.record({
      name: "UserCreated",
      payload: { userId: user.id, roles: user.roles },
      idempotencyKey: `user-created:${user.id}`,
      correlationId: "local",
    });
    if (passwordHash) {
      this.events.record({
        name: "UserActivated",
        payload: { userId: user.id },
        idempotencyKey: `user-activated:${user.id}`,
        correlationId: "local",
      });
    }
    return {
      ...toUserDetail(await this.requireUser(user.id)),
      activation: activation
        ? { status: activation.status, expiresAt: activation.expiresAt.toISOString() }
        : undefined,
    };
  }

  async update(userId: string, input: UpdateUserInput, actorUserId = "system") {
    const user = await this.requireUser(userId);
    const nextStatus = input.status ?? user.status;
    if (
      user.roles.includes("ADMIN") &&
      nextStatus === "DISABLED" &&
      (await this.activeAdminCount(userId)) === 0
    ) {
      throw new ConflictException("At least one active Admin is required");
    }
    const saved = await this.repository.saveUser({
      ...user,
      displayName: input.displayName ?? user.displayName,
      status: nextStatus,
      disabledAt: nextStatus === "DISABLED" ? new Date() : undefined,
    });
    if (nextStatus === "DISABLED") await this.revokeUserSessions(userId, "USER_DISABLED");
    await this.audit.record({
      eventType: nextStatus === "DISABLED" ? "USER_DISABLED" : "USER_UPDATED",
      actorUserId,
      targetUserId: userId,
      resource: "users",
      metadata: input,
    });
    return toUserDetail(saved);
  }

  async revokeUserSessions(userId: string, reason: string) {
    for (const session of await this.repository.activeSessionsForUser(userId)) {
      session.status = "REVOKED";
      session.revokedAt = new Date();
      session.revocationReason = reason;
      await this.repository.saveSession(session);
      await this.audit.record({
        eventType: "SESSION_REVOKED",
        targetUserId: userId,
        sessionId: session.id,
        resource: "sessions",
        metadata: { reason },
      });
    }
  }

  async delete(userId: string, actorUserId = "system") {
    if (userId === actorUserId)
      throw new BadRequestException("Admin cannot delete their own account");
    const user = await this.requireUser(userId);
    const saved = await this.repository.saveUser({
      ...user,
      status: "DISABLED",
      isDeleted: true,
      disabledAt: new Date(),
    });
    await this.revokeUserSessions(userId, "USER_DELETED");
    await this.audit.record({
      eventType: "USER_DELETED",
      actorUserId,
      targetUserId: userId,
      resource: "users",
      metadata: {},
    });
    return toUserDetail(saved);
  }

  async activeAdminCount(excludingUserId?: string) {
    return (await this.repository.listUsers()).filter(
      (user) =>
        user.id !== excludingUserId && user.status === "ACTIVE" && user.roles.includes("ADMIN"),
    ).length;
  }

  async requireUser(userId: string) {
    const user = await this.repository.findUser(userId);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  assertValidRoles(roles: string[]) {
    if (roles.length === 0) throw new BadRequestException("At least one role is required");
  }
}
