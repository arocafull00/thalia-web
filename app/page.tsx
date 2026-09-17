import { redirect } from "next/navigation";

/*
 * Si Supabase rechaza el `redirect_to` —porque la URL no encaja con ninguna
 * entrada de Redirect URLs— no devuelve un error: cae al Site URL, que es esta
 * raíz, y el código de autorización aterriza aquí en vez de en /callback (#161).
 *
 * Sin este reenvío el `redirect` a /dashboard se lleva el código por delante y
 * el login se rompe en silencio: nadie lo canjea, el proxy no encuentra sesión
 * y acaba devolviendo a /login sin un solo error por el camino.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (code) {
    redirect(`/callback?code=${encodeURIComponent(code)}`);
  }

  redirect("/dashboard");
}
