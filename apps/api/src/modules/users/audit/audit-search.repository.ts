import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository.js";
import type { AuditSearchInput } from "../users.schemas.js";

@Injectable()
export class AuditSearchRepository {
  constructor(private readonly repository: UsersRepository) {}

  search(query: AuditSearchInput) {
    return this.repository.searchAudits(query);
  }
}
