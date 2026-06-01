import { loadUsersRbacOpenApiContract } from "./users-rbac-contract.js";

export async function verifyUsersRbac(): Promise<void> {
  const contract = loadUsersRbacOpenApiContract();
  const requiredFragments = [
    "/users",
    "/activation/complete",
    "/permissions/matrix",
    "/teams",
    "/audit/security",
  ];

  const missing = requiredFragments.filter((fragment) => !contract.includes(fragment));
  if (missing.length > 0) {
    throw new Error(`Users & RBAC contract missing paths: ${missing.join(", ")}`);
  }
}

if (process.argv[1]?.endsWith("verify-users-rbac.ts")) {
  verifyUsersRbac()
    .then(() => {
      console.log("Users & RBAC verification passed");
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
