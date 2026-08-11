import { useAppointmentsStore } from "@/stores/appointments-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useEmployeesStore } from "@/stores/employees-store";
import { useFinancesStore } from "@/stores/finances-store";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePatientsStore } from "@/stores/patients-store";
import { emptyQueryEntry } from "@/stores/query-state";
import { useTreatmentStore } from "@/stores/treatment-store";

export function resetClinicQueryData() {
  useAppointmentsStore.setState({
    byRange: {},
    byPage: {},
    byId: {},
    appointmentInventoryById: {},
    defaultMaterialsByKey: {},
  });
  useDashboardStore.setState({ data: emptyQueryEntry() });
  useEmployeesStore.setState({
    list: emptyQueryEntry(),
    byId: {},
    statsByEmployeeId: {},
    appointmentsByEmployeeId: {},
  });
  useFinancesStore.setState({ transactionsByKey: {}, summaryByKey: {} });
  useInventoryStore.setState({
    list: emptyQueryEntry(),
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
  useTreatmentStore.setState({
    list: emptyQueryEntry(),
    byPage: {},
    categories: emptyQueryEntry(),
    byId: {},
  });
}
