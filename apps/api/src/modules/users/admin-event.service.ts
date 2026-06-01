import { Injectable } from "@nestjs/common";

export interface AdministrationEventRecord {
  name: string;
  payload: Record<string, unknown>;
  idempotencyKey: string;
  correlationId: string;
  status: "RECORDED" | "DISPATCHED" | "HANDLED" | "FAILED";
}

@Injectable()
export class AdminEventService {
  private readonly events = new Map<string, AdministrationEventRecord>();

  record(event: Omit<AdministrationEventRecord, "status">): AdministrationEventRecord {
    const existing = this.events.get(event.idempotencyKey);
    if (existing) return existing;
    const recorded = { ...event, status: "RECORDED" as const };
    this.events.set(event.idempotencyKey, recorded);
    return recorded;
  }

  list(): AdministrationEventRecord[] {
    return [...this.events.values()];
  }
}
