import { NextResponse, type NextRequest } from "next/server";

import { updateSession, withSessionCookies } from "@/lib/supabase/proxy";

const publicRoutes = ["/login", "/register-employee", "/create-clinic", "/invite-team"];

const pwaRoutes = ["/manifest.webmanifest", "/sw.js"];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, userId } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  if (pwaRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js).*)"],
};
