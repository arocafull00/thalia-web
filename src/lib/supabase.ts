import { createBrowserClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl, isSupabaseConfigured } from "@/lib/environment";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export function assertSupabaseConfigured() {
  if (isSupabaseConfigured) {
    return;
  }

  throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}
