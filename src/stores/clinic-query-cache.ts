import { useSyncExternalStore } from "react";

import { logger } from "@/lib/logger";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { useAppointmentRemindersStore } from "@/stores/appointment-reminders-store";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { useCalendarConnectionStore } from "@/stores/calendar-connection-store";
import {
  clearPersistedUser,
  enableClinicPersistWrites,
  getReadyClinicPersistScope,
  setClinicPersistScope,
  subscribeClinicPersist,
} from "@/stores/clinic-query-persist";
import { useClinicNotificationsStore } from "@/stores/clinic-notifications-store";
import { useClinicInfoStore } from "@/stores/clinic-info-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useEmployeesStore } from "@/stores/employees-store";
import { useFinancesStore } from "@/stores/finances-store";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import { usePatientsStore } from "@/stores/patients-store";
import { resetClinicQueryData } from "@/stores/reset-clinic-query-data";
import { useTransactionCategoriesStore } from "@/stores/transaction-categories-store";
import { useTreatmentImagesStore } from "@/stores/treatment-images-store";
import { useTreatmentStore } from "@/stores/treatment-store";
import { useWhatsAppSettingsStore } from "@/stores/whatsapp-settings-store";

type Scope = { userId: string; clinicId: string };

let requestedScope: string | null = null;
let transition = Promise.resolve();

function rehydrateStores() {
  return Promise.all([
    useAppointmentsStore.persist.rehydrate(),
    useAppointmentRemindersStore.persist.rehydrate(),
    useCampaignsStore.persist.rehydrate(),
    useCalendarConnectionStore.persist.rehydrate(),
    useClinicNotificationsStore.persist.rehydrate(),
    useClinicInfoStore.persist.rehydrate(),
    useDashboardStore.persist.rehydrate(),
    useEmployeesStore.persist.rehydrate(),
    useFinancesStore.persist.rehydrate(),
    useInventoryAlertsStore.persist.rehydrate(),
    useInventoryStore.persist.rehydrate(),
    usePatientFilesStore.persist.rehydrate(),
    usePatientImagesStore.persist.rehydrate(),
    usePatientsStore.persist.rehydrate(),
    useTransactionCategoriesStore.persist.rehydrate(),
    useTreatmentImagesStore.persist.rehydrate(),
    useTreatmentStore.persist.rehydrate(),
    useWhatsAppSettingsStore.persist.rehydrate(),
  ]);
}

export function activateClinicQueryCache(scope: Scope) {
  const key = `${scope.userId}:${scope.clinicId}`;
  if (requestedScope === key && getReadyClinicPersistScope() === key) return transition;
  requestedScope = key;
  setClinicPersistScope(null);

  transition = transition.catch(() => undefined).then(async () => {
    if (requestedScope !== key) return;
    resetClinicQueryData();
    setClinicPersistScope(scope);
    try {
      await rehydrateStores();
    } catch (cause) {
      logger.captureException(cause, { store: "clinic-query-cache", action: "rehydrate" });
    }
    if (requestedScope !== key) return;
    enableClinicPersistWrites();
  });

  return transition;
}

export function useClinicQueryCacheReady(userId: string | null, clinicId: string | null) {
  const readyScope = useSyncExternalStore(
    subscribeClinicPersist,
    getReadyClinicPersistScope,
    () => null,
  );
  return Boolean(userId && clinicId && readyScope === `${userId}:${clinicId}`);
}

export async function clearUserQueryCache(userId: string) {
  if (requestedScope?.startsWith(`${userId}:`)) {
    requestedScope = null;
    setClinicPersistScope(null);
    resetClinicQueryData();
    await transition.catch(() => undefined);
    if (requestedScope === null) resetClinicQueryData();
  }
  try {
    await clearPersistedUser(userId);
  } catch (cause) {
    logger.captureException(cause, { store: "clinic-query-cache", action: "clearUser", userId });
  }
}
