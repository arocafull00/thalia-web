import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

const SESSION_POLL_MS = 50;
const SESSION_MAX_ATTEMPTS = 40;

export async function waitForAuthSessionReady() {
  for (let attempt = 0; attempt < SESSION_MAX_ATTEMPTS; attempt += 1) {
    const { loading, session } = useAuthStore.getState();

    if (!loading && session?.access_token) {
      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user) {
        useAuthStore.getState().setSession({ ...session, user: data.user });
        return data.user;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, SESSION_POLL_MS));
  }

  return useAuthStore.getState().session?.user ?? null;
}
