import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedRequest } from "../../../common/guards/session.guard.js";
import { toLeadHistoryResponse } from "../leads.dto.js";
import { LeadRepository } from "../leads.repository.js";
import { LeadAccessService } from "../permissions/lead-access.service.js";
import { LeadHistoryRepository } from "./lead-history.repository.js";

type LeadUser = AuthenticatedRequest["user"];

@Injectable()
export class LeadHistoryService {
  constructor(
    private readonly leads: LeadRepository,
    private readonly history: LeadHistoryRepository,
    private readonly access: LeadAccessService,
  ) {}

  async list(
    leadId: string,
    query: { page: number; pageSize: number },
    user: LeadUser,
    correlationId = "local",
  ) {
    const lead = await this.leads.findById(leadId);
    if (!lead) throw new NotFoundException("Lead not found");
    const decision = await this.access.decide({
      user,
      lead,
      action: "VIEW_HISTORY",
      correlationId,
    });
    if (!decision.allowed) throw new ForbiddenException("Permission denied");

    const result = await this.history.list({ leadId, page: query.page, pageSize: query.pageSize });
    return toLeadHistoryResponse(result.items, {
      page: query.page,
      pageSize: query.pageSize,
      total: result.total,
      correlationId,
    });
  }
}
