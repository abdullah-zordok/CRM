import { spawnSync } from "node:child_process";

const commands = [
  ["format:check"],
  ["lint"],
  ["--filter", "@crm/api", "build"],
  ["--filter", "@crm/web", "build"],
  ["db:migrate"],
  ["db:seed"],
  ["test:unit"],
  ["test:contract"],
  ["test:integration"],
  ["verify:users-rbac"],
];

for (const args of commands) {
  const result =
    process.platform === "win32"
      ? spawnSync("cmd.exe", ["/d", "/s", "/c", ["pnpm", ...args].join(" ")], {
          stdio: "inherit",
        })
      : spawnSync("pnpm", args, {
          stdio: "inherit",
        });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("CI verification passed");
