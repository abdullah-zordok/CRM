import type { ActivityRecord } from "./activity.repository.js";
import { resolveActivityDueState } from "./activity.types.js";

function activityKind(activity: ActivityRecord) {
  return activity.dueAt ? "FOLLOW_UP" : "ACTIVITY";
}

function followUpStatus(activity: ActivityRecord) {
  if (!activity.dueAt) return null;
  if (activity.status === "COMPLETED") return "COMPLETED";
  if (activity.status === "CANCELED") return "CANCELLED";
  if (activity.dueAt < new Date()) return "OVERDUE";
  if (activity.status === "IN_PROGRESS") return "IN_PROGRESS";
  return "PENDING";
}

function notePreview(note: string | null) {
  if (!note) return null;
  return note.length > 140 ? `${note.slice(0, 137)}...` : note;
}

export function toActivitySummaryDto(activity: ActivityRecord, correlationId = "local") {
  const status = resolveActivityDueState({
    status: activity.status,
    dueAt: activity.dueAt,
  });

  return {
    id: activity.id,
    leadId: activity.leadId,
    leadDisplayName: activity.lead.displayName,
    type: activity.type,
    status,
    kind: activityKind(activity),
    followUpStatus: followUpStatus(activity),
    ownerUserId: activity.ownerUserId,
    ownerDisplayName: activity.owner.displayName,
    recordedByUserId: activity.recordedByUserId,
    recordedByDisplayName: activity.recorder.displayName,
    teamId: activity.teamId,
    activityAt: activity.activityAt?.toISOString() ?? null,
    dueAt: activity.dueAt?.toISOString() ?? null,
    completedAt: activity.completedAt?.toISOString() ?? null,
    outcome: activity.outcome,
    notePreview: notePreview(activity.note),
    version: activity.version,
    recordedAt: activity.createdAt.toISOString(),
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
    correlationId,
  };
}

export function toActivityDetailDto(activity: ActivityRecord, correlationId = "local") {
  return {
    ...toActivitySummaryDto(activity, correlationId),
    note: activity.note,
    permissions: {
      canComplete: activity.status === "PLANNED",
      canReassign: activity.status === "PLANNED",
      canCancel: activity.status === "PLANNED",
      canCorrect: activity.status === "COMPLETED",
    },
  };
}
