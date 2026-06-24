import { createBrowserClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl } from "@/lib/environment";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
