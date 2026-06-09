import { readFileSync, existsSync } from "node:fs";

export async function verifyExhibitionsModule(): Promise<void> {
  const contract = readFileSync("packages/contracts/openapi.yaml", "utf8");
  const requiredFragments = [
    "/exhibitions:",
    "/exhibitions/{exhibitionId}:",
    "/exhibitions/{exhibitionId}/archive:",
    "/exhibitions/{exhibitionId}/restore:",
    "/exhibitions/{exhibitionId}/attendees:",
    "/exhibitions/{exhibitionId}/attendees/{attendeeId}/confirm:",
    "/exhibitions/{exhibitionId}/lead-attributions:",
    "/exhibitions/{exhibitionId}/lead-attributions/{attributionId}:",
    "/exhibitions/{exhibitionId}/summary:",
    "CreateExhibitionRequest:",
    "ExhibitionListResponse:",
    "ExhibitionDetail:",
  ];
  const missing = requiredFragments.filter((fragment) => !contract.includes(fragment));
  if (missing.length > 0) {
    throw new Error(`Exhibitions Module contract missing fragments: ${missing.join(", ")}`);
  }

  // we only check events if the file exists (it is created in Phase 2)
  if (existsSync("apps/api/src/modules/exhibitions/exhibition.types.ts")) {
    const eventSource = readFileSync(
      "apps/api/src/modules/exhibitions/exhibition.types.ts",
      "utf8",
    );
    const missingEvents = [
      "ExhibitionCreated",
      "ExhibitionUpdated",
      "ExhibitionStatusChanged",
      "ExhibitionAttendeeAssigned",
      "ExhibitionAttendanceConfirmed",
      "ExhibitionLeadAttributed",
      "ExhibitionAttributionCorrected",
    ].filter((eventName) => !eventSource.includes(eventName));
    if (missingEvents.length > 0) {
      throw new Error(
        `Exhibitions Module event source missing events: ${missingEvents.join(", ")}`,
      );
    }
  }
}

if (process.argv[1]?.endsWith("verify-exhibitions-module.ts")) {
  verifyExhibitionsModule()
    .then(() => {
      console.log("Exhibitions Module verification passed");
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
