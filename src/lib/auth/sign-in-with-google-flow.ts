import { useAuthStore } from "@/stores/auth-store";

export async function signInWithGoogleFlow(): Promise<{ error: string | null }> {
  try {
    await useAuthStore.getState().signInWithGoogle();
    await useAuthStore.getState().refreshProfile();
    return { error: null };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "No se pudo iniciar sesión con Google" };
  }
}
