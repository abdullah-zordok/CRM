export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "EXHIBITION_VISIT" | "WHATSAPP" | "OTHER";
export type ActivityOutcome =
  | "CONNECTED"
  | "NO_ANSWER"
  | "QUALIFIED_INTEREST"
  | "FOLLOW_UP_REQUIRED"
  | "NOT_INTERESTED"
  | "OTHER";

export interface ActivityFactoryInput {
  leadId?: string;
  ownerUserId?: string;
  type?: ActivityType;
  activityAt?: string;
  dueAt?: string;
  outcome?: ActivityOutcome;
  note?: string;
}

export const SEEDED_ADMIN_ID = "00000000-0000-4000-8000-000000000001";

export function createCompletedActivityFactoryInput(
  input: ActivityFactoryInput = {},
): Required<
  Pick<ActivityFactoryInput, "leadId" | "ownerUserId" | "type" | "activityAt" | "outcome">
> &
  Pick<ActivityFactoryInput, "note"> {
  return {
    leadId: input.leadId ?? "00000000-0000-4000-8000-000000000101",
    ownerUserId: input.ownerUserId ?? SEEDED_ADMIN_ID,
    type: input.type ?? "CALL",
    activityAt: input.activityAt ?? new Date().toISOString(),
    outcome: input.outcome ?? "CONNECTED",
    note: input.note,
  };
}

export function createFollowUpFactoryInput(
  input: ActivityFactoryInput = {},
): Required<Pick<ActivityFactoryInput, "leadId" | "ownerUserId" | "type" | "dueAt">> &
  Pick<ActivityFactoryInput, "note"> {
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 1);
  return {
    leadId: input.leadId ?? "00000000-0000-4000-8000-000000000101",
    ownerUserId: input.ownerUserId ?? SEEDED_ADMIN_ID,
    type: input.type ?? "CALL",
    dueAt: input.dueAt ?? dueAt.toISOString(),
    note: input.note,
  };
}
