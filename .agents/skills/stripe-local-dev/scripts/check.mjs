import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  checkStripeCli,
  getProjectRoot,
  loadMergedEnv,
  maskSecret,
  pingSupabase,
  validateStripeEnv,
} from "./lib.mjs";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

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
const { errors, supabaseUrl, supabaseKey } = validateStripeEnv(env);

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

process.stdout.write("Stripe local: prerequisitos OK\n");
process.stdout.write(`  Stripe CLI: ${stripeCli.version}\n`);
process.stdout.write(`  Cuenta Stripe: ${stripeCli.accountId}\n`);
process.stdout.write(`  Supabase: ${supabaseUrl}\n`);
process.stdout.write(`  Site URL: ${env.NEXT_PUBLIC_SITE_URL}\n`);
process.stdout.write(
  `  STRIPE_SECRET_KEY: ${maskSecret(env.STRIPE_SECRET_KEY)}\n`,
);
process.stdout.write(
  `  STRIPE_PRICE_THALIA_NORMAL: ${env.STRIPE_PRICE_THALIA_NORMAL}\n`,
);
process.stdout.write(
  `  STRIPE_WEBHOOK_SECRET: ${maskSecret(env.STRIPE_WEBHOOK_SECRET)}\n`,
);
