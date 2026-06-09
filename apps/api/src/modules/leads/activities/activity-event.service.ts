import { Injectable } from "@nestjs/common";
import type { ActivityDomainEventName } from "./activity.types.js";
import { LeadEventService } from "../events/lead-event.service.js";

@Injectable()
export class ActivityEventService {
  constructor(private readonly events: LeadEventService) {}

  record(input: {
    name: ActivityDomainEventName;
    activityId: string;
    leadId: string;
    payload: Record<string, unknown>;
    correlationId: string;
  }) {
    return this.events.record({
      name: input.name,
      leadId: input.leadId,
      payload: { ...input.payload, activityId: input.activityId },
      idempotencyKey: `${input.name}:${input.activityId}:${input.correlationId}`,
      correlationId: input.correlationId,
    });
  }
}
