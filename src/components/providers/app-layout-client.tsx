"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AppShell from "@/components/ui/app-shell";
import { Notice } from "@/components/ui/primitives/notice";
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
  const { loading, user } = useAuth();
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
      router.replace("/no-membership");
    }
  }, [clinicId, clinicLoading, loading, router, user]);

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
      <div className="flex min-h-screen items-center justify-center bg-surface text-ink-secondary">
        Cargando...
      </div>
    );
  }

  if (!user || !clinicId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <Notice message="Redirigiendo..." />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
