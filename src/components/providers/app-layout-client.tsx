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
import {
  activateClinicQueryCache,
  useClinicQueryCacheReady,
} from "@/stores/clinic-query-cache";
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
  const { initialized, loading, session, user } = useAuth();
  const {
    accountType,
    hasBillingAccess,
    clinicId,
    membership,
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
  const cacheReady = useClinicQueryCacheReady(user?.id ?? null, clinicId);
  const canReceiveClinicNotifications =
    platformRole === "owner" ||
    platformRole === "admin" ||
    platformRole === "external";

  useEffect(() => {
    initSounds();
  }, []);

  useEffect(() => {
    if (
      !initialized ||
      !user?.id ||
      session?.user.id !== user.id ||
      !clinicId ||
      membership?.clinicId !== clinicId ||
      cacheReady
    ) {
      return;
    }

    void activateClinicQueryCache({ userId: user.id, clinicId });
  }, [cacheReady, clinicId, initialized, membership?.clinicId, session?.user.id, user?.id]);

  useEffect(() => {
    if (!cacheReady || !clinicId || !canManageBusiness) return;
    void fetchAlerts(clinicId);
    subscribeRealtime(clinicId);
    return () => {
      unsubscribeRealtime();
    };
  }, [
    canManageBusiness,
    cacheReady,
    clinicId,
    fetchAlerts,
    subscribeRealtime,
    unsubscribeRealtime,
  ]);

  useEffect(() => {
    if (!cacheReady || !clinicId || !canReceiveClinicNotifications) {
      return;
    }

    void fetchClinicNotifications(clinicId);
    subscribeClinicNotifications(clinicId);

    return () => {
      unsubscribeClinicNotifications();
    };
  }, [
    canReceiveClinicNotifications,
    cacheReady,
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
      if (accountType === "external") {
        router.replace("/no-membership");
        return;
      }

      const profileComplete = hasRegistrationProfile(user);
      router.replace(profileComplete ? "/create-clinic" : "/register-employee");
      return;
    }

    if (clinicId && accountType !== "external" && !hasBillingAccess) {
      router.replace("/subscription");
    }
  }, [
    accountType,
    clinicId,
    clinicLoading,
    hasBillingAccess,
    loading,
    router,
    user,
  ]);

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

  if (
    clientReady &&
    (!user || !clinicId || !membership || (accountType !== "external" && !hasBillingAccess))
  ) {
    return <RedirectScreen />;
  }

  if (!user || !membership || session?.user.id !== user.id) {
    return <RedirectScreen />;
  }

  if (!cacheReady) {
    return <BootLoadingScreen authLoading={false} clinicLoading={true} />;
  }

  return (
    <AppShell defaultSidebarOpen={defaultSidebarOpen}>{children}</AppShell>
  );
}
