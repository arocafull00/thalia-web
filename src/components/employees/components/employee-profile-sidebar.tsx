import EmployeeProfileHeader from "@/components/employees/components/employee-profile-header";
import EmployeeProfileSummary from "@/components/employees/components/employee-profile-summary";
import EmployeeQuickActions from "@/components/employees/components/employee-quick-actions";
import type { EmployeeAppointmentStats } from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

type EmployeeProfileSidebarProps = {
  employee: Employee;
  stats: EmployeeAppointmentStats | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
  onEdit: () => void;
  onToggleStatus: () => void;
};

export default function EmployeeProfileSidebar({
  employee,
  stats,
  isLoading,
  error,
  onEdit,
  onToggleStatus,
}: EmployeeProfileSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border-subtle">
      <EmployeeProfileHeader employee={employee} />

      <div className="border-t border-border-subtle" />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EmployeeProfileSummary
          employee={employee}
          stats={stats}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="mt-auto shrink-0 border-t border-border-subtle">
        <EmployeeQuickActions
          employee={employee}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </aside>
  );
}
