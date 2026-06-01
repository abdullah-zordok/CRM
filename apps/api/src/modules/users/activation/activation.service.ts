import { createHash, randomBytes } from "node:crypto";
import { BadRequestException, GoneException, Injectable, NotFoundException } from "@nestjs/common";
import { PasswordService } from "../../auth/security/password.service.js";
import { UsersRepository } from "../users.repository.js";
import { UsersSecurityAuditService } from "../audit/users-security-audit.service.js";
import type { CompleteActivationInput } from "../users.schemas.js";

@Injectable()
export class ActivationService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly audit: UsersSecurityAuditService,
    private readonly passwords: PasswordService,
  ) {}

  hashToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
  }

  async issue(userId: string, createdByUserId?: string, ttlMinutes = 60) {
    const user = await this.repository.findUser(userId);
    if (!user) throw new NotFoundException("User not found");

    for (const token of await this.repository.activeActivationsForUser(userId)) {
      token.status = "REVOKED";
      token.revokedAt = new Date();
      await this.repository.markActivation(token);
    }

    const rawToken = randomBytes(32).toString("hex");
    const record = await this.repository.saveActivation({
      id: this.repository.nextId(),
      userId,
      tokenHash: this.hashToken(rawToken),
      rawToken,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
      createdByUserId,
      createdAt: new Date(),
    });

    await this.audit.record({
      eventType: "ACTIVATION_SENT",
      actorUserId: createdByUserId,
      targetUserId: userId,
      resource: "activation",
      metadata: { activationToken: rawToken, expiresAt: record.expiresAt.toISOString() },
    });

    return record;
  }

  async complete(input: CompleteActivationInput): Promise<void> {
    const record = await this.repository.findActivation(this.hashToken(input.activationToken));
    if (!record) throw new BadRequestException("Invalid activation");
    if (record.status !== "ACTIVE" || record.expiresAt.getTime() < Date.now()) {
      record.status = record.status === "ACTIVE" ? "EXPIRED" : record.status;
      await this.repository.markActivation(record);
      await this.audit.record({
        eventType: "ACTIVATION_EXPIRED",
        outcome: "FAILURE",
        targetUserId: record.userId,
        resource: "activation",
      });
      throw new GoneException("Activation expired or revoked");
    }

    const user = await this.repository.findUser(record.userId);
    if (!user) throw new NotFoundException("User not found");
    record.status = "USED";
    record.usedAt = new Date();
    await this.repository.markActivation(record);
    await this.repository.saveUser({
      ...user,
      status: "ACTIVE",
      activatedAt: new Date(),
      passwordHash: await this.passwords.hash(input.password),
    });
    await this.audit.record({
      eventType: "ACTIVATION_USED",
      targetUserId: user.id,
      resource: "activation",
      metadata: { password: "[REDACTED]" },
    });
  }
}
