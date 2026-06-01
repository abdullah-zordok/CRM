import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadUsersRbacOpenApiContract(): string {
  return readFileSync(resolve("packages/contracts/openapi.yaml"), "utf8");
}
