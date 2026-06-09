import { readFileSync } from "node:fs";

export async function verifyActivitiesTimeline(): Promise<void> {
  const contract = readFileSync("packages/contracts/openapi.yaml", "utf8");
  const requiredFragments = [
    "/activities:",
    "/leads/{leadId}/activities:",
    "/activities/{activityId}/complete:",
    "/activities/{activityId}/reassign:",
    "/activities/{activityId}/cancel:",
    "CreateActivityRequest:",
    "ActivityListResponse:",
    "ActivityTimelineResponse:",
  ];
  const missing = requiredFragments.filter((fragment) => !contract.includes(fragment));
  if (missing.length > 0) {
    throw new Error(`Activities Timeline contract missing fragments: ${missing.join(", ")}`);
  }

  const eventSource = readFileSync("apps/api/src/modules/leads/leads.types.ts", "utf8");
  const missingEvents = [
    "ActivityCreated",
    "FollowUpScheduled",
    "FollowUpCompleted",
    "FollowUpReassigned",
    "ActivityCanceled",
  ].filter((eventName) => !eventSource.includes(eventName));
  if (missingEvents.length > 0) {
    throw new Error(`Activities Timeline event source missing events: ${missingEvents.join(", ")}`);
  }
}

if (process.argv[1]?.endsWith("verify-activities-timeline.ts")) {
  verifyActivitiesTimeline()
    .then(() => {
      console.log("Activities Timeline verification passed");
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
