import { useEffect, useState } from "react";

import {
  resolvePostAuthRoute,
  resolveUnauthenticatedRoute,
} from "@/lib/navigation/resolve-post-auth-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useClinicStore } from "@/stores/clinic-store";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

export function usePostAuthRedirect(enabled: boolean) {
  const { user, loading: authLoading } = useAuth();
  const introSeen = useOnboardingStore((state) => state.introSeen);
  const introCompleted = useOnboardingStore((state) => state.completed);
  const intent = useOnboardingIntentStore((state) => state.intent);
  const pendingToken = usePendingInviteStore((state) => state.token);
  const activeClinicId = useClinicStore((state) => state.activeClinicId);
  const clinicHydrated = useClinicStore((state) => state.hydrated);
  const fetchMemberships = useClinicStore((state) => state.fetchMemberships);
  const setActiveClinic = useClinicStore((state) => state.setActiveClinic);

  const [href, setHref] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || authLoading || !clinicHydrated) {
      return;
    }

    let cancelled = false;

    const resolve = async () => {
      let resolvedUser = user;

      if (user) {
        const { data: userData } = await supabase.auth.getUser();

        if (userData.user) {
          resolvedUser = userData.user;
        }
      }

      const resolvedMemberships = resolvedUser ? await fetchMemberships(resolvedUser.id) : [];

      if (cancelled) {
        return;
      }

      const resolvedActiveClinicId = useClinicStore.getState().activeClinicId;

      const result = resolvedUser
        ? resolvePostAuthRoute({
            pendingInviteToken: pendingToken,
            onboardingIntent: intent,
            introCompleted,
            memberships: resolvedMemberships,
            activeClinicId: resolvedActiveClinicId,
            isAuthenticated: true,
            user: resolvedUser,
          })
        : {
            href: resolveUnauthenticatedRoute(introSeen, pendingToken),
          };

      if (result.setActiveClinicId) {
        setActiveClinic(result.setActiveClinicId);
      }

      setHref(result.href);
      setReady(true);
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    authLoading,
    clinicHydrated,
    user?.id,
    user?.user_metadata?.full_name,
    user?.user_metadata?.registration_profile_complete,
    user?.user_metadata?.registration_pending_invites,
    user?.user_metadata?.intended_operational_role,
    introSeen,
    introCompleted,
    intent,
    pendingToken,
    activeClinicId,
    fetchMemberships,
    setActiveClinic,
  ]);

  return {
    href,
    ready: ready && !authLoading && clinicHydrated,
  };
}
