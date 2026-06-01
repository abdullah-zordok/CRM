import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { UsersRepository } from "../users/users.repository.js";
import { toLeadDetailDto, toLeadSourceDto, toLeadSummaryDto } from "./leads.dto.js";
import { LeadDuplicateService } from "./leads-duplicate.service.js";
import { LeadRepository } from "./leads.repository.js";
import type { CreateLeadInput, LeadSearchInput } from "./leads.schemas.js";
import { LeadAuditService } from "./audit/lead-audit.service.js";
import { LeadEventService } from "./events/lead-event.service.js";
import { LeadAccessService } from "./permissions/lead-access.service.js";
import { LeadSourceService } from "./sources/lead-source.service.js";

type LeadUser = AuthenticatedRequest["user"];

@Injectable()
export class LeadService {
  constructor(
    private readonly repository: LeadRepository,
    private readonly sources: LeadSourceService,
    private readonly duplicates: LeadDuplicateService,
    private readonly access: LeadAccessService,
    private readonly audit: LeadAuditService,
    private readonly events: LeadEventService,
    private readonly users: UsersRepository,
  ) {}

  async listSources(correlationId = "local") {
    return {
      items: (await this.sources.listActive()).map(toLeadSourceDto),
      correlationId,
    };
  }

  async create(input: CreateLeadInput, user: LeadUser, correlationId = "local") {
    if (!user) throw new ForbiddenException("Permission denied");
    const decision = await this.access.decide({ user, action: "CREATE", correlationId });
    if (!decision.allowed) throw new ForbiddenException("Permission denied");
    await this.sources.requireActive(input.sourceCode);
    await this.duplicates.assertNoActiveDuplicate({ email: input.email, phone: input.phone, user });

    const owner = await this.users.findUser(input.ownerUserId);
    if (!owner || owner.status !== "ACTIVE") {
      throw new NotFoundException("Eligible lead owner not found");
    }
    const ownerMembership = await this.users.activeMembershipForUser(owner.id);

    const lead = await this.repository.create({
      data: input,
      createdByUserId: user.id,
      teamId: ownerMembership?.team.id,
      correlationId,
    });

    await this.audit.record({
      eventType: "LEAD_CREATED",
      actorUserId: user.id,
      leadId: lead.id,
      correlationId,
      metadata: { sourceCode: lead.sourceCode, priority: lead.priority },
    });
    await this.events.record({
      name: "LeadCreated",
      leadId: lead.id,
      payload: { leadId: lead.id, ownerUserId: lead.ownerUserId, sourceCode: lead.sourceCode },
      idempotencyKey: `lead-created:${lead.id}`,
      correlationId,
    });

    return toLeadDetailDto(lead, correlationId);
  }

  async detail(leadId: string, user: LeadUser, correlationId = "local") {
    const lead = await this.repository.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");
    const decision = await this.access.decide({ user, lead, action: "VIEW", correlationId });
    if (!decision.allowed) throw new ForbiddenException("Permission denied");
    return toLeadDetailDto(lead, correlationId);
  }

  async search(query: LeadSearchInput, user: LeadUser, correlationId = "local") {
    const decision = await this.access.decide({ user, action: "SEARCH", correlationId });
    if (!decision.allowed || !user) throw new ForbiddenException("Permission denied");
    const scope = this.scopeForUser(user);
    const result = await this.repository.search({ query, scope });
    return {
      items: result.items.map((lead) => toLeadSummaryDto(lead, correlationId)),
      page: query.page,
      pageSize: query.pageSize,
      total: result.total,
      correlationId,
    };
  }

  private scopeForUser(user: NonNullable<LeadUser>): Prisma.LeadWhereInput {
    if (user.roles.includes("ADMIN")) return {};
    if (user.roles.includes("MANAGER") && user.activeTeam?.id)
      return { teamId: user.activeTeam.id };
    return { ownerUserId: user.id };
  }
}
