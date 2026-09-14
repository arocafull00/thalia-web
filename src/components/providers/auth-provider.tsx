"use client";

import { useEffect, useSyncExternalStore } from "react";

import { clearBrowserQueryClient } from "@/lib/query/query-client";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicRequestsStore } from "@/stores/clinic-requests-store";
import { useClinicStore } from "@/stores/clinic-store";

type AuthProviderProps = {
  children: React.ReactNode;
};

function clearAuthState() {
  clearBrowserQueryClient();
  useClinicRequestsStore.getState().clearRequests();
  useClinicStore.getState().clearClinicState();
  useAuthStore.setState({ profile: null });
}

async function hydrateUserData(userId: string) {
  const authState = useAuthStore.getState();
  const clinicState = useClinicStore.getState();

  if (
    authState.profile?.id === userId &&
    clinicState.memberships.length > 0
  ) {
    return;
  }

  await useClinicStore.getState().fetchMemberships(userId);
  await useAuthStore.getState().refreshProfile();
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    let cancelled = false;

    async function syncSession() {
      await supabase.auth.getUser();
      if (cancelled) {
        return;
      }

      const { data } = await supabase.auth.getSession();
      const { setSession, setLoading } = useAuthStore.getState();
      setSession(data.session);

      if (!data.session?.user.id) {
        clearAuthState();
        setLoading(false);
        return;
      }

      await hydrateUserData(data.session.user.id);
      if (cancelled) {
        return;
      }

      setLoading(false);
    }

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      useAuthStore.getState().setSession(nextSession);

      setTimeout(() => {
        if (cancelled) {
          return;
        }

        if (!nextSession?.user.id) {
          if (event === "SIGNED_OUT") {
            clearAuthState();
            useAuthStore.getState().setLoading(false);
          }
          return;
        }

        if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
          return;
        }

        useClinicStore.setState({ loading: true });
        void hydrateUserData(nextSession.user.id)
          .catch(() => useAuthStore.setState({ profile: null }))
          .finally(() => useClinicStore.setState({ loading: false }));
      }, 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return children;
}

const subscribeToClientHydration = () => () => {};

function getClientHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

export function useAuthHydrated() {
  return useSyncExternalStore(
    subscribeToClientHydration,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot,
  );
}
