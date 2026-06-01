import { ConflictException, Injectable } from "@nestjs/common";
import type { AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { LeadErrorCode } from "./leads.dto.js";
import { LeadRepository } from "./leads.repository.js";
import { LeadAccessService } from "./permissions/lead-access.service.js";

@Injectable()
export class LeadDuplicateService {
  constructor(
    private readonly repository: LeadRepository,
    private readonly access: LeadAccessService,
  ) {}

  async assertNoActiveDuplicate(input: {
    email?: string;
    phone?: string;
    user?: AuthenticatedRequest["user"];
  }) {
    const duplicate = await this.repository.findActiveDuplicate(input);
    if (!duplicate) return;
    const decision = await this.access.evaluate(input.user, duplicate, "VIEW");
    throw new ConflictException({
      code: decision.allowed ? LeadErrorCode.DuplicateVisible : LeadErrorCode.DuplicateRestricted,
      message: decision.allowed
        ? "An active lead already exists with this contact detail."
        : "An active lead already exists with this contact detail.",
      visibleLeadId: decision.allowed ? duplicate.id : null,
      restrictedMatch: !decision.allowed,
      correlationId: "local",
    });
  }
}
