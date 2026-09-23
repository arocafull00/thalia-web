import { clearBrowserQueryClient } from "@/lib/query/query-client";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { useAppointmentRemindersStore } from "@/stores/appointment-reminders-store";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { useCalendarConnectionStore } from "@/stores/calendar-connection-store";
import { setClinicPersistScope } from "@/stores/clinic-query-persist";
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
import { advanceQueryEpoch } from "@/stores/query-epoch";
import { emptyQueryEntry } from "@/stores/query-state";
import { useTransactionCategoriesStore } from "@/stores/transaction-categories-store";
import { useTreatmentImagesStore } from "@/stores/treatment-images-store";
import { useTreatmentStore } from "@/stores/treatment-store";
import { useWhatsAppSettingsStore } from "@/stores/whatsapp-settings-store";

export function resetClinicQueryData() {
  setClinicPersistScope(null);
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
    recipientsByCampaignId: {},
  });
  useDashboardStore.setState({ data: emptyQueryEntry() });
  useEmployeesStore.setState({ queries: {} });
  useClinicInfoStore.setState({ byId: {} });
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
  useCalendarConnectionStore.setState({ byEmployeeId: {} });
  useAppointmentRemindersStore.setState({ byAppointmentId: {}, sending: false });
  usePatientFilesStore.setState({
    filesByPatientId: {},
    globalFilesByQuery: {},
  });
  usePatientImagesStore.setState({ imagesByPatientId: {}, imagesByQuery: {} });
  useTreatmentImagesStore.setState({ byTreatmentId: {} });
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
  useWhatsAppSettingsStore.setState({ byClinicId: {}, saving: false });
}
