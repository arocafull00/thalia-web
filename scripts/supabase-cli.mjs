import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const result = spawnSync("supabase", args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
