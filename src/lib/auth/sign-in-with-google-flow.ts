import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { useAuthStore } from "@/stores/auth-store";
import {
  useOnboardingIntentStore,
  type OnboardingIntent,
} from "@/stores/onboarding-intent-store";

type SignInWithGoogleFlowOptions = {
  onboardingIntent?: OnboardingIntent;
  next?: string;
};

export async function signInWithGoogleFlow(
  options: SignInWithGoogleFlowOptions = {},
): Promise<{ error: string | null }> {
  const { onboardingIntent, next = "/dashboard" } = options;

  if (onboardingIntent) {
    useOnboardingIntentStore.getState().setIntent(onboardingIntent);
  } else if (!useOnboardingIntentStore.getState().intent) {
    useOnboardingIntentStore.getState().setIntent("owner");
  }

  try {
    await useAuthStore.getState().signInWithGoogle(next);
    return { error: null };
  } catch (cause) {
    return { error: getAuthErrorMessage(cause) };
  }
}
