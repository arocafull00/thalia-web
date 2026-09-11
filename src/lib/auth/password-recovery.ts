import { createClient, type AuthError } from "@supabase/supabase-js";

import { supabaseAnonKey, supabaseUrl } from "@/lib/environment";

const passwordRecoveryClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: "implicit",
    persistSession: false,
  },
});

export async function requestPasswordRecovery(
  email: string,
): Promise<AuthError | null> {
  const redirectTo = new URL(
    "/reset-password",
    globalThis.location.origin,
  ).toString();
  const { error } = await passwordRecoveryClient.auth.resetPasswordForEmail(
    email.trim(),
    { redirectTo },
  );

  return error;
}
