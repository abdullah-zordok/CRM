import { Injectable, NotFoundException } from "@nestjs/common";
import { LeadRepository } from "../leads.repository.js";

@Injectable()
export class LeadSourceService {
  constructor(private readonly leads: LeadRepository) {}

  listActive() {
    return this.leads.listSources();
  }

  async requireActive(sourceCode: string) {
    const source = await this.leads.findSource(sourceCode);
    if (!source) throw new NotFoundException("Lead source not found");
    return source;
  }
}
