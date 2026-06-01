import { loadLeadsCoreOpenApiContract } from "./leads-core-contract.js";
import { readFileSync } from "node:fs";

export async function verifyLeadsCore(): Promise<void> {
  const contract = loadLeadsCoreOpenApiContract();
  const requiredFragments = [
    "/leads:",
    "/leads/{leadId}:",
    "/leads/{leadId}/assignment:",
    "AssignLeadRequest:",
    "LeadAssignmentHistory:",
    "/leads/{leadId}/status:",
    "ChangeLeadStatusRequest:",
    "LeadStatusHistory:",
    "/leads/{leadId}/notes:",
    "/leads/{leadId}/history:",
    "AddLeadNoteRequest:",
    "LeadHistoryResponse:",
    "/leads/sources:",
    "DuplicateLeadConflict:",
    "StaleUpdate:",
  ];

  const missing = requiredFragments.filter((fragment) => !contract.includes(fragment));
  if (missing.length > 0) {
    throw new Error(`Leads Core contract missing fragments: ${missing.join(", ")}`);
  }

  const eventSource = readFileSync("apps/api/src/modules/leads/leads.types.ts", "utf8");
  const missingEvents = [
    "LeadAssigned",
    "LeadStatusChanged",
    "LeadNoteAdded",
    "LeadExhibitionReferenceChanged",
  ].filter((eventName) => !eventSource.includes(eventName));
  if (missingEvents.length > 0) {
    throw new Error(`Leads Core event source missing events: ${missingEvents.join(", ")}`);
  }
}

if (process.argv[1]?.endsWith("verify-leads-core.ts")) {
  verifyLeadsCore()
    .then(() => {
      console.log("Leads Core verification passed");
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
