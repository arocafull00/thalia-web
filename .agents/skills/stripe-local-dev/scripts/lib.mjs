import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export const WEBHOOK_FORWARD_URL =
  "http://localhost:3000/api/stripe/webhook";
export const LOCAL_SITE_URL = "http://localhost:3000";

const PLACEHOLDER_PATTERN = /replace_me|^$/i;

const REQUIRED_STRIPE_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_THALIA_NORMAL",
];

const SUPABASE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
];

export function getProjectRoot() {
  return process.cwd();
}

export function parseDotenv(content) {
  const env = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export function loadMergedEnv(root = getProjectRoot()) {
  const merged = {};

  for (const file of [".env", ".env.local"]) {
    const path = join(root, file);
    if (!existsSync(path)) {
      continue;
    }

    Object.assign(merged, parseDotenv(readFileSync(path, "utf8")));
  }

  return merged;
}

export function maskSecret(value) {
  if (!value || value.length < 12) {
    return "(vacío o inválido)";
  }

  return `${value.slice(0, 8)}…`;
}

function isPlaceholder(value) {
  if (value === undefined || value === null) {
    return true;
  }

  return PLACEHOLDER_PATTERN.test(String(value).trim());
}

function isLiveStripeKey(value) {
  return /_(live)_/i.test(value);
}

export function runCommand(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

export function validateStripeEnv(env, options = {}) {
  const { allowPlaceholderWebhookSecret = false } = options;
  const errors = [];

  for (const key of REQUIRED_STRIPE_KEYS) {
    if (allowPlaceholderWebhookSecret && key === "STRIPE_WEBHOOK_SECRET") {
      continue;
    }

    const value = env[key];
    if (isPlaceholder(value)) {
      errors.push(`${key} falta o tiene un placeholder en .env.local`);
    }
  }

  if (env.NEXT_PUBLIC_SITE_URL !== LOCAL_SITE_URL) {
    errors.push(
      `NEXT_PUBLIC_SITE_URL debe ser ${LOCAL_SITE_URL} (actual: ${env.NEXT_PUBLIC_SITE_URL ?? "(vacío)"})`,
    );
  }

  for (const key of ["STRIPE_SECRET_KEY", "STRIPE_PRICE_THALIA_NORMAL"]) {
    const value = env[key];
    if (value && isLiveStripeKey(value)) {
      errors.push(`${key} parece una clave live; usa test en local`);
    }
  }

  let supabaseUrl;
  let supabaseKey;

  for (const entry of SUPABASE_KEYS) {
    if (Array.isArray(entry)) {
      for (const key of entry) {
        if (!isPlaceholder(env[key])) {
          supabaseKey = env[key];
          break;
        }
      }
      continue;
    }

    if (!isPlaceholder(env[entry])) {
      supabaseUrl = env[entry];
    }
  }

  if (!supabaseUrl) {
    errors.push(
      "NEXT_PUBLIC_SUPABASE_URL falta en .env o .env.local",
    );
  }

  if (!supabaseKey) {
    errors.push(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY) falta en .env o .env.local",
    );
  }

  return { errors, supabaseUrl, supabaseKey };
}

export async function pingSupabase(url, apiKey) {
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
    method: "HEAD",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 401 || response.status === 404) {
    return;
  }

  if (!response.ok && response.status >= 500) {
    throw new Error(`Supabase respondió HTTP ${response.status}`);
  }
}

export function readEnvLocal(root = getProjectRoot()) {
  const path = join(root, ".env.local");
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function updateWebhookSecretInEnvLocal(newSecret, root = getProjectRoot()) {
  const path = join(root, ".env.local");
  const previous = readEnvLocal(root);
  const previousSecret = previous
    ? parseDotenv(previous).STRIPE_WEBHOOK_SECRET
    : undefined;

  let content = previous ?? "";
  const line = `STRIPE_WEBHOOK_SECRET=${newSecret}`;

  if (/^STRIPE_WEBHOOK_SECRET=/m.test(content)) {
    content = content.replace(/^STRIPE_WEBHOOK_SECRET=.*/m, line);
  } else if (content.length > 0 && !content.endsWith("\n")) {
    content += `\n${line}\n`;
  } else {
    content += `${line}\n`;
  }

  writeFileSync(path, content, "utf8");

  return {
    changed: previousSecret !== newSecret,
    previousSecret,
  };
}

export async function isDevServerRunning() {
  try {
    const response = await fetch(LOCAL_SITE_URL, {
      signal: AbortSignal.timeout(2_000),
    });
    return response.status > 0;
  } catch {
    return false;
  }
}

export function checkStripeCli() {
  const version = runCommand("stripe", ["version"]);
  if (version.status !== 0) {
    return {
      ok: false,
      message:
        "Stripe CLI no encontrada. Instala con: pnpm add -g @stripe/cli@latest",
    };
  }

  const whoami = runCommand("stripe", ["whoami", "--format", "json"]);
  if (whoami.status !== 0) {
    return {
      ok: false,
      message: "Stripe CLI sin sesión. Ejecuta: stripe login",
    };
  }

  let accountId = "desconocida";
  try {
    const parsed = JSON.parse(whoami.stdout);
    accountId = parsed.account_id ?? parsed.account ?? accountId;
  } catch {
    accountId = whoami.stdout.trim() || accountId;
  }

  return {
    ok: true,
    version: version.stdout.trim(),
    accountId,
  };
}
