"use client";

import { useEffect, useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const { setSession, setLoading, refreshProfile } = useAuthStore.getState();

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setLoading(false);

      if (!data.session?.user.id) {
        useClinicStore.getState().clearClinicState();
        useAuthStore.setState({ profile: null });
        return;
      }

      await useClinicStore.getState().fetchMemberships(data.session.user.id);
      await refreshProfile();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user.id) {
        useClinicStore.getState().clearClinicState();
        useAuthStore.setState({ profile: null });
        return;
      }

      refreshProfile()
        .then(() =>
          useClinicStore.getState().fetchMemberships(nextSession.user.id),
        )
        .catch(() => useAuthStore.setState({ profile: null }));
    });

    return () => subscription.unsubscribe();
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
