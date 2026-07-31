import { spawnSync } from "node:child_process";

const e2eUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "e2e@landora.test",
  password: "LandoraE2E123!",
};

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
const secretKey =
  status.SECRET_KEY ??
  status.SERVICE_ROLE_KEY ??
  status.secret_key ??
  status.service_role_key;

if (!apiUrl || !publishableKey || !secretKey) {
  process.stderr.write(
    "No se pudieron obtener las credenciales de Supabase local.\n",
  );
  process.exit(1);
}

const supabaseHostname = new URL(apiUrl).hostname;

if (supabaseHostname !== "127.0.0.1" && supabaseHostname !== "localhost") {
  process.stderr.write(
    `La suite E2E solo puede usar Supabase local, no ${supabaseHostname}.\n`,
  );
  process.exit(1);
}

async function requestAuth(pathname, apiKey, options) {
  const response = await fetch(`${apiUrl}/auth/v1${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      apikey: apiKey,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return;
  }

  const body = await response.json().catch(() => null);
  const message =
    body?.message ??
    body?.msg ??
    body?.error_description ??
    body?.error ??
    `HTTP ${response.status}`;

  throw new Error(message);
}

try {
  await requestAuth(`/admin/users/${e2eUser.id}`, secretKey, {
    method: "PUT",
    body: JSON.stringify({
      email: e2eUser.email,
      email_confirm: true,
      password: e2eUser.password,
    }),
  });
  await requestAuth("/token?grant_type=password", publishableKey, {
    method: "POST",
    body: JSON.stringify({
      email: e2eUser.email,
      password: e2eUser.password,
    }),
  });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`No se pudo preparar el usuario E2E local: ${message}\n`);
  process.exit(1);
}

const playwrightResult = spawnSync(
  "pnpm",
  ["exec", "playwright", "test", ...process.argv.slice(2)],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: apiUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: publishableKey,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
      PORT: "3001",
      E2E_BASE_URL: "http://127.0.0.1:3001",
    },
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

process.exit(playwrightResult.status ?? 1);
