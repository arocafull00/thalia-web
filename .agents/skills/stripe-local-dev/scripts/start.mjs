import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import {
  WEBHOOK_FORWARD_URL,
  LOCAL_SITE_URL,
  checkStripeCli,
  getProjectRoot,
  isDevServerRunning,
  loadMergedEnv,
  maskSecret,
  pingSupabase,
  updateWebhookSecretInEnvLocal,
  validateStripeEnv,
} from "./lib.mjs";

const LISTEN_TIMEOUT_MS = 30_000;
const PID_FILE = ".stripe-listen.pid";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function pidFilePath(root) {
  return join(root, PID_FILE);
}

function isProcessAlive(pid) {
  if (!pid || Number.isNaN(pid)) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readListenPid(root) {
  const path = pidFilePath(root);
  if (!existsSync(path)) {
    return null;
  }

  const raw = readFileSync(path, "utf8").trim();
  const pid = Number.parseInt(raw, 10);
  if (!isProcessAlive(pid)) {
    return null;
  }

  return pid;
}

function writeListenPid(root, pid) {
  writeFileSync(pidFilePath(root), `${pid}\n`, "utf8");
}

async function runCheck() {
  const root = getProjectRoot();
  const envLocalPath = join(root, ".env.local");

  if (!existsSync(envLocalPath)) {
    fail(
      "Falta .env.local. Cópialo desde .env.local.example y configura las claves Stripe de test.",
    );
  }

  const stripeCli = checkStripeCli();
  if (!stripeCli.ok) {
    fail(stripeCli.message);
  }

  const env = loadMergedEnv(root);
  const { errors, supabaseUrl, supabaseKey } = validateStripeEnv(env, {
    allowPlaceholderWebhookSecret: true,
  });

  if (errors.length > 0) {
    for (const error of errors) {
      process.stderr.write(`${error}\n`);
    }
    process.exit(1);
  }

  try {
    await pingSupabase(supabaseUrl, supabaseKey);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    fail(`Supabase no responde en ${supabaseUrl}: ${message}`);
  }

  return { env, stripeCli };
}

function waitForWebhookSecret(child) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => {
      reject(
        new Error(
          "stripe listen no devolvió whsec_… a tiempo. Revisa la terminal del listener.",
        ),
      );
    }, LISTEN_TIMEOUT_MS);

    const onData = (chunk) => {
      output += chunk.toString();
      const match = output.match(/whsec_[a-zA-Z0-9]+/);
      if (!match) {
        return;
      }

      clearTimeout(timeout);
      child.stdout?.off("data", onData);
      child.stderr?.off("data", onData);
      resolve(match[0]);
    };

    child.stdout?.on("data", onData);
    child.stderr?.on("data", onData);

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`stripe listen terminó con código ${code}`));
      }
    });
  });
}

function startStripeListen(root) {
  const existingPid = readListenPid(root);
  if (existingPid) {
    fail(
      `stripe listen ya corre (PID ${existingPid}). Para el proceso o borra ${PID_FILE} antes de volver a arrancar.`,
    );
  }

  const child = spawn(
    "stripe",
    ["listen", "--forward-to", WEBHOOK_FORWARD_URL],
    {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    },
  );

  child.unref();

  if (!child.pid) {
    fail("No se pudo arrancar stripe listen");
  }

  writeListenPid(root, child.pid);
  return child;
}

function startDevServer(root) {
  const child = spawn("pnpm", ["dev"], {
    cwd: root,
    detached: true,
    stdio: "ignore",
    shell: process.platform === "win32",
  });

  child.unref();
  return child.pid ?? null;
}

const root = getProjectRoot();
const { env } = await runCheck();

const listenChild = startStripeListen(root);
let whsec;

try {
  whsec = await waitForWebhookSecret(listenChild);
} catch (cause) {
  const message = cause instanceof Error ? cause.message : String(cause);
  fail(message);
}

const { changed } = updateWebhookSecretInEnvLocal(whsec, root);

const devAlreadyRunning = await isDevServerRunning();
let devPid = null;

if (devAlreadyRunning) {
  process.stdout.write("pnpm dev ya responde en :3000; no se arrancó otro.\n");
} else {
  devPid = startDevServer(root);
}

process.stdout.write("\nEntorno Stripe local listo\n");
process.stdout.write(`  Webhook forward: ${WEBHOOK_FORWARD_URL}\n`);
process.stdout.write(`  stripe listen PID: ${listenChild.pid}\n`);
process.stdout.write(`  STRIPE_WEBHOOK_SECRET: ${maskSecret(whsec)}\n`);

if (changed) {
  process.stdout.write(
    "  El webhook secret cambió. Reinicia pnpm dev si ya estaba corriendo.\n",
  );
}

if (devPid) {
  process.stdout.write(`  pnpm dev PID: ${devPid}\n`);
}

process.stdout.write(`\nPrueba manual:\n`);
process.stdout.write(`  1. ${LOCAL_SITE_URL}/register\n`);
process.stdout.write(`  2. /subscription → Checkout con 4242 4242 4242 4242\n`);
process.stdout.write(`  3. Confirma 200 en stripe listen y acceso al dashboard\n`);
