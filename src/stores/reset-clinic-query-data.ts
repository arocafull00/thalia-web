import { useAppointmentsStore } from "@/stores/appointments-store";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useFinancesStore } from "@/stores/finances-store";
import { useClinicNotificationsStore } from "@/stores/clinic-notifications-store";
import { useInventoryStore } from "@/stores/inventory-store";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import { usePatientsStore } from "@/stores/patients-store";
import { advanceQueryEpoch } from "@/stores/query-epoch";
import { emptyQueryEntry } from "@/stores/query-state";
import { useTransactionCategoriesStore } from "@/stores/transaction-categories-store";
import { useTreatmentStore } from "@/stores/treatment-store";
import { clearBrowserQueryClient } from "@/lib/query/query-client";

export function resetClinicQueryData() {
  advanceQueryEpoch();
  clearBrowserQueryClient();
  useAppointmentsStore.setState({
    byRange: {},
    byPage: {},
    byId: {},
    appointmentInventoryById: {},
    defaultMaterialsByKey: {},
  });
  useCampaignsStore.setState({
    byPage: {},
    byId: {},
    quota: emptyQueryEntry(),
  });
  useDashboardStore.setState({ data: emptyQueryEntry() });
  useFinancesStore.setState({
    byPage: {},
    summaryByKey: {},
  });
  useInventoryStore.setState({
    list: emptyQueryEntry(),
    byPage: {},
    categories: emptyQueryEntry(),
    summary: emptyQueryEntry(),
    byId: {},
    movementsByItemId: {},
  });
  usePatientsStore.setState({
    listBySearch: {},
    byPage: {},
    byId: {},
    appointmentsByPatientId: {},
    upcomingByPatientId: {},
  });
  usePatientFilesStore.setState({
    filesByPatientId: {},
    globalFilesByQuery: {},
  });
  usePatientImagesStore.setState({ imagesByPatientId: {} });
  useInventoryAlertsStore.setState({
    alerts: emptyQueryEntry(),
    unreadCount: 0,
  });
  useClinicNotificationsStore.setState({
    notifications: emptyQueryEntry(),
    unreadCount: 0,
  });
  useTreatmentStore.setState({
    list: emptyQueryEntry(),
    byPage: {},
    categories: emptyQueryEntry(),
    byId: {},
  });
  useTransactionCategoriesStore.setState({ byClinic: {}, mutating: false });
}
