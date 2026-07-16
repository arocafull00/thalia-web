import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { useAuthStore } from "@/stores/auth-store";

export async function signInWithGoogleFlow(): Promise<{
  error: string | null;
}> {
  try {
    await useAuthStore.getState().signInWithGoogle();
    return { error: null };
  } catch (cause) {
    return { error: getAuthErrorMessage(cause) };
  }
}
