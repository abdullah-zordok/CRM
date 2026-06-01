import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";

@Injectable()
export class LeadHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: { leadId: string; page: number; pageSize: number }) {
    const where = { leadId: input.leadId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.leadHistoryEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prisma.leadHistoryEntry.count({ where }),
    ]);
    return { items, total };
  }
}
