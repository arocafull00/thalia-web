import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_AUTH_DESTINATION = "/dashboard";

function resolveDestination(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTH_DESTINATION;
  }

  return next;
}

function createAuthErrorDestination(origin: string, next: string) {
  if (next !== "/reset-password") {
    return new URL("/login?error=oauth", origin);
  }

  const destination = new URL("/reset-password", origin);
  destination.searchParams.set("error_code", "invalid_recovery_link");

  return destination;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = resolveDestination(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(createAuthErrorDestination(url.origin, next));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    /*
     * El motivo es lo único que distingue una causa de otra: "code verifier
     * should be non-empty" significa que el flujo empezó en otro host y la
     * cookie no viajó, y no se parece en nada a un código ya canjeado. Sin
     * esto el fallo no deja rastro en ningún sitio —ni aquí ni en Sentry—
     * porque la ruta devuelve un redirect normal en vez de lanzar (#161).
     */
    logger.captureException(error, {
      action: "exchangeCodeForSession",
      host: url.host,
      next,
    });

    return NextResponse.redirect(createAuthErrorDestination(url.origin, next));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
