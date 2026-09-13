"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import AppShell from "@/components/ui/app-shell";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePendingClinicRequests } from "@/lib/hooks/use-pending-clinic-requests";
import { hasRegistrationProfile } from "@/lib/registration-metadata";
import { initSounds } from "@/lib/sound";
import { useClinicNotificationsStore } from "@/stores/clinic-notifications-store";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { useShellStore } from "@/stores/shell-store";

type AppLayoutClientProps = {
  children: React.ReactNode;
  defaultSidebarOpen?: boolean;
};

export default function AppLayoutClient({
  children,
  defaultSidebarOpen,
}: AppLayoutClientProps) {
  const router = useRouter();
  const { loading, user } = useAuth();
  const {
    accountType,
    clinicId,
    platformRole,
    loading: clinicLoading,
  } = useActiveClinic();
  usePendingClinicRequests(user?.email, accountType === "external");
  const setNavVisibility = useShellStore((state) => state.setNavVisibility);
  const subscribeRealtime = useInventoryAlertsStore(
    (state) => state.subscribeRealtime,
  );
  const unsubscribeRealtime = useInventoryAlertsStore(
    (state) => state.unsubscribeRealtime,
  );
  const fetchAlerts = useInventoryAlertsStore((state) => state.fetchAlerts);
  const subscribeClinicNotifications = useClinicNotificationsStore(
    (state) => state.subscribeRealtime,
  );
  const unsubscribeClinicNotifications = useClinicNotificationsStore(
    (state) => state.unsubscribeRealtime,
  );
  const fetchClinicNotifications = useClinicNotificationsStore(
    (state) => state.fetchNotifications,
  );

  const canManageBusiness = platformRole === "owner";
  const canReceiveClinicNotifications =
    platformRole === "owner" ||
    platformRole === "admin" ||
    platformRole === "external";

  useEffect(() => {
    initSounds();
  }, []);

  useEffect(() => {
    if (!clinicId || !canManageBusiness) return;
    void fetchAlerts(clinicId);
    subscribeRealtime(clinicId);
    return () => {
      unsubscribeRealtime();
    };
  }, [
    canManageBusiness,
    clinicId,
    fetchAlerts,
    subscribeRealtime,
    unsubscribeRealtime,
  ]);

  useEffect(() => {
    if (!clinicId || !canReceiveClinicNotifications) {
      return;
    }

    void fetchClinicNotifications(clinicId);
    subscribeClinicNotifications(clinicId);

    return () => {
      unsubscribeClinicNotifications();
    };
  }, [
    canReceiveClinicNotifications,
    clinicId,
    fetchClinicNotifications,
    subscribeClinicNotifications,
    unsubscribeClinicNotifications,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!clinicId && !clinicLoading) {
      const profileComplete = hasRegistrationProfile(user);
      router.replace(profileComplete ? "/create-clinic" : "/register-employee");
    }
  }, [clinicId, clinicLoading, loading, router, user]);

  useEffect(() => {
    setNavVisibility({
      showEmployees: canManageBusiness,
      showFinances: canManageBusiness,
      showInventory: canManageBusiness,
    });
  }, [canManageBusiness, setNavVisibility]);

  const awaitingClientAuth = loading;

  if (awaitingClientAuth) {
    return (
      <BootLoadingScreen authLoading={loading} clinicLoading={clinicLoading} />
    );
  }

  const clientReady = !loading && !clinicLoading;

  if (clientReady && (!user || !clinicId)) {
    return <RedirectScreen />;
  }

  if (!user) {
    return <RedirectScreen />;
  }

  return (
    <div className="animate-in fade-in-0 duration-500">
      <AppShell defaultSidebarOpen={defaultSidebarOpen}>{children}</AppShell>
    </div>
  );
}
