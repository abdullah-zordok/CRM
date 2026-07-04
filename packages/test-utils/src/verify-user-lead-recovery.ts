import { loadUserLeadRecoveryOpenApiContract } from "./user-lead-recovery-contract.js";

export async function verifyUserLeadRecovery(): Promise<void> {
  const contract = loadUserLeadRecoveryOpenApiContract();
  const requiredFragments = [
    "/auth/login",
    "/users",
    "/users/{userId}",
    "delete:",
    "/leads",
    "/dashboard/operations",
    "password",
    "ownerUserId",
    "createdByUserId",
  ];

  const missing = requiredFragments.filter((fragment) => !contract.includes(fragment));
  if (missing.length > 0) {
    throw new Error(`User and Lead Recovery contract missing fragments: ${missing.join(", ")}`);
  }
}

if (process.argv[1]?.endsWith("verify-user-lead-recovery.ts")) {
  verifyUserLeadRecovery()
    .then(() => {
      console.log("User and Lead Recovery verification passed");
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
