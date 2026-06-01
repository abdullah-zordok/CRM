import { Injectable } from "@nestjs/common";
import { toAuditDto } from "../users.dto.js";
import type { AuditSearchInput } from "../users.schemas.js";
import { UsersSecurityAuditService } from "./users-security-audit.service.js";
import { AuditSearchRepository } from "./audit-search.repository.js";

@Injectable()
export class AuditSearchService {
  constructor(
    private readonly repository: AuditSearchRepository,
    private readonly audit: UsersSecurityAuditService,
  ) {}

  async search(query: AuditSearchInput, actorUserId = "system") {
    const page = query.page;
    const pageSize = query.pageSize;
    const records = await this.repository.search(query);
    await this.audit.record({
      eventType: "AUDIT_VIEWED",
      actorUserId,
      resource: "audit",
      metadata: query,
    });
    return {
      items: records.slice((page - 1) * pageSize, page * pageSize).map(toAuditDto),
      page,
      pageSize,
      total: records.length,
      correlationId: "local",
    };
  }
}
