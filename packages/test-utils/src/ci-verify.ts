import { spawnSync } from "node:child_process";

const commands = [
  ["pnpm", ["format:check"]],
  ["pnpm", ["lint"]],
  ["pnpm", ["build"]],
  ["pnpm", ["db:migrate"]],
  ["pnpm", ["db:seed"]],
  ["pnpm", ["test:unit"]],
  ["pnpm", ["test:contract"]],
  ["pnpm", ["test:integration"]],
  ["pnpm", ["verify:users-rbac"]],
] as const;

for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("CI verification passed");
