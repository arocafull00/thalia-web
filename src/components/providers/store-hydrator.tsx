"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo } from "react";

import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";
import type { ClinicMembershipView } from "@/types/clinic-membership";
import type { Employee } from "@/types/database.types";

type StoreHydratorProps = {
  user: User | null;
  profile: Employee | null;
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  children: React.ReactNode;
};

type ServerBootstrapState = Omit<StoreHydratorProps, "children">;

const ServerBootstrapContext = createContext<ServerBootstrapState | null>(null);

export function useServerBootstrap() {
  return useContext(ServerBootstrapContext);
}

export default function StoreHydrator({
  user,
  profile,
  memberships,
  activeClinicId,
  children,
}: StoreHydratorProps) {
  useEffect(() => {
    useAuthStore.setState({ profile, loading: false });
    useClinicStore.setState({
      memberships,
      activeClinicId,
      loading: false,
    });
  }, [activeClinicId, memberships, profile]);

  const value = useMemo(
    () => ({ user, profile, memberships, activeClinicId }),
    [activeClinicId, memberships, profile, user],
  );

  return (
    <ServerBootstrapContext.Provider value={value}>
      {children}
    </ServerBootstrapContext.Provider>
  );
}
