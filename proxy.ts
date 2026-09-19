import { NextResponse, type NextRequest } from "next/server";

import { updateSession, withSessionCookies } from "@/lib/supabase/proxy";

const publicRoutes = [
  "/callback",
  "/login",
  "/register",
  "/register-employee",
  "/create-clinic",
  "/invite-team",
  "/invite",
  "/forgot-password",
  "/reset-password",
  "/no-membership",
  "/terms",
  "/privacidad",
  "/cita",
  "/api/stripe/webhook",
  /*
   * La llama pg_cron de servidor a servidor, sin sesión. No queda desprotegida:
   * la ruta exige un secreto compartido en la cabecera y responde 401 sin él.
   */
  "/api/google-calendar/sync",
];

const pwaRoutes = ["/manifest.webmanifest", "/sw.js"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, userId } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  if (pwaRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  const isPublicRoute = publicRoutes.some((route) =>
    matchesRoute(pathname, route),
  );

  if (!userId && !isPublicRoute && pathname !== "/") {
    return withSessionCookies(
      NextResponse.redirect(new URL("/login", request.url)),
      supabaseResponse,
    );
  }

  if (userId && (pathname === "/login" || pathname === "/")) {
    return withSessionCookies(
      NextResponse.redirect(new URL("/dashboard", request.url)),
      supabaseResponse,
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|monitoring|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)",
  ],
};
