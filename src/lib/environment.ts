export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "missing-publishable-key";

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const googleWebClientId = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "https://www.thalia-app.es" : null);
