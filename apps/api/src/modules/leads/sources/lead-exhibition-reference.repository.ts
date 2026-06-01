import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";

@Injectable()
export class LeadExhibitionReferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertReference(input: {
    leadId: string;
    name: string;
    date?: string | null;
    location?: string | null;
    actorUserId: string;
    correlationId: string;
  }) {
    const reference = await this.prisma.leadExhibitionReference.upsert({
      where: { leadId: input.leadId },
      update: {
        name: input.name,
        date: input.date ? new Date(input.date) : null,
        location: input.location,
        updatedByUserId: input.actorUserId,
      },
      create: {
        leadId: input.leadId,
        name: input.name,
        date: input.date ? new Date(input.date) : null,
        location: input.location,
        createdByUserId: input.actorUserId,
        updatedByUserId: input.actorUserId,
      },
    });
    await this.prisma.leadHistoryEntry.create({
      data: {
        leadId: input.leadId,
        entryType: "EXHIBITION_REFERENCE_CHANGED",
        actorUserId: input.actorUserId,
        summary: "Exhibition reference changed",
        metadata: { referenceId: reference.id, name: reference.name },
        correlationId: input.correlationId,
      },
    });
    return reference;
  }
}
