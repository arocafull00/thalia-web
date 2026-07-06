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
    <aside className="order-1 flex h-full min-h-0 flex-col border-b border-border-subtle lg:order-1 lg:border-r lg:border-b-0">
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

      <div className="mt-auto hidden shrink-0 border-t border-border-subtle lg:block">
        <EmployeeQuickActions
          employee={employee}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </aside>
  );
}
