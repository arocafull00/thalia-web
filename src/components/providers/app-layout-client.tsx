"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import AppShell from "@/components/ui/app-shell";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { initSounds } from "@/lib/sound";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { useShellStore } from "@/stores/shell-store";

type AppLayoutClientProps = {
  children: React.ReactNode;
};

export default function AppLayoutClient({ children }: AppLayoutClientProps) {
  const router = useRouter();
  const { loading, profile, user } = useAuth();
  const { clinicId, platformRole, loading: clinicLoading } = useActiveClinic();
  const setNavVisibility = useShellStore((state) => state.setNavVisibility);
  const subscribeRealtime = useInventoryAlertsStore(
    (state) => state.subscribeRealtime,
  );
  const unsubscribeRealtime = useInventoryAlertsStore(
    (state) => state.unsubscribeRealtime,
  );
  const fetchAlerts = useInventoryAlertsStore((state) => state.fetchAlerts);

  const canManageClinic =
    platformRole === "owner" ||
    platformRole === "admin" ||
    platformRole === null;

  useEffect(() => {
    initSounds();
  }, []);

  useEffect(() => {
    if (!clinicId) return;
    void fetchAlerts(clinicId);
    subscribeRealtime(clinicId);
    return () => {
      unsubscribeRealtime();
    };
  }, [clinicId, fetchAlerts, subscribeRealtime, unsubscribeRealtime]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!clinicId && !clinicLoading) {
      router.replace(profile ? "/create-clinic" : "/register");
    }
  }, [clinicId, clinicLoading, loading, profile, router, user]);

  useEffect(() => {
    const isExternal = platformRole === "external";
    setNavVisibility({
      showEmployees: canManageClinic && !isExternal,
      showFinances: canManageClinic && !isExternal,
      showInventory: !isExternal,
    });
  }, [canManageClinic, platformRole, setNavVisibility]);

  if (loading || (user && !clinicId && clinicLoading)) {
    return (
      <BootLoadingScreen authLoading={loading} clinicLoading={clinicLoading} />
    );
  }

  if (!user || !clinicId) {
    return <RedirectScreen />;
  }

  return (
    <div className="animate-in fade-in-0 duration-500">
      <AppShell>{children}</AppShell>
    </div>
  );
}
