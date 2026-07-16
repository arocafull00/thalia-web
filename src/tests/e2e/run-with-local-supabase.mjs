import { spawnSync } from "node:child_process";

const statusResult = spawnSync(
  "pnpm",
  ["exec", "supabase", "status", "--output", "json"],
  {
    encoding: "utf8",
    shell: process.platform === "win32",
  },
);

if (statusResult.status !== 0) {
  process.stderr.write(statusResult.stderr);
  process.stderr.write(
    "Supabase local no está disponible. Ejecuta `pnpm exec supabase start` antes de los tests E2E.\n",
  );
  process.exit(statusResult.status ?? 1);
}

const status = JSON.parse(statusResult.stdout);
const apiUrl = status.API_URL ?? status.api_url ?? status.api?.url;
const publishableKey =
  status.PUBLISHABLE_KEY ??
  status.ANON_KEY ??
  status.publishable_key ??
  status.anon_key;

if (!apiUrl || !publishableKey) {
  process.stderr.write(
    "No se pudieron obtener la URL y la clave pública de Supabase local.\n",
  );
  process.exit(1);
}

const playwrightResult = spawnSync(
  "pnpm",
  ["exec", "playwright", "test", ...process.argv.slice(2)],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: apiUrl,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
    },
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

process.exit(playwrightResult.status ?? 1);
