import EmployeeProfileSummary from "@/components/employees/components/employee-profile-summary";
import EmployeeTimeline from "@/components/employees/components/employee-timeline";
import type { EmployeeDetailTabId } from "@/lib/hooks/use-employee-detail-tabs";
import type {
  EmployeeAppointmentRow,
  EmployeeAppointmentStats,
} from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

type EmployeeDetailTabContentProps = {
  activeTab: EmployeeDetailTabId;
  employee: Employee;
  stats: EmployeeAppointmentStats | undefined;
  statsLoading: boolean;
  statsError: Error | null | undefined;
  appointments: EmployeeAppointmentRow[];
  appointmentsLoading: boolean;
  appointmentsError: Error | null | undefined;
};

export default function EmployeeDetailTabContent({
  activeTab,
  employee,
  stats,
  statsLoading,
  statsError,
  appointments,
  appointmentsLoading,
  appointmentsError,
}: EmployeeDetailTabContentProps) {
  if (activeTab === "summary") {
    return (
      <EmployeeProfileSummary
        employee={employee}
        stats={stats}
        isLoading={statsLoading}
        error={statsError}
      />
    );
  }

  return (
    <EmployeeTimeline
      appointments={appointments}
      isLoading={appointmentsLoading}
      error={appointmentsError}
    />
  );
}
