import { resolvePostAuthRoute } from "@/lib/navigation/resolve-post-auth-route";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

export async function navigateAfterAuth() {
  const session = (await supabase.auth.getSession()).data.session;

  if (!session) {
    globalThis.location.href = "/login";
    return;
  }

  useAuthStore.getState().setSession(session);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    globalThis.location.href = "/login";
    return;
  }

  await useAuthStore.getState().refreshProfile();
  const memberships = await useClinicStore.getState().fetchMemberships(user.id);

  const result = resolvePostAuthRoute({
    pendingInviteToken: usePendingInviteStore.getState().token,
    onboardingIntent: useOnboardingIntentStore.getState().intent,
    introCompleted: useOnboardingStore.getState().completed,
    memberships,
    activeClinicId: useClinicStore.getState().activeClinicId,
    isAuthenticated: true,
    user,
  });

  if (result.setActiveClinicId) {
    useClinicStore.getState().setActiveClinic(result.setActiveClinicId);
  }

  globalThis.location.href = result.href;
}
