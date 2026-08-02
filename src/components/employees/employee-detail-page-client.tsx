"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import EmployeeDetailHeader from "@/components/employees/components/detail/employee-detail-header";
import EmployeeDetailTabBar from "@/components/employees/components/detail/employee-detail-tab-bar";
import EmployeeDetailTabContent from "@/components/employees/components/detail/employee-detail-tab-content";
import EmployeeEditDialog from "@/components/employees/components/form/employee-edit-dialog";
import EmployeeStatusConfirmDialog from "@/components/employees/components/form/employee-status-confirm-dialog";
import {
  getEmployeeDetailMenuSections,
  getEmployeeDetailPrimaryAction,
} from "@/components/employees/employee-detail-actions";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type {
  EmployeeAppointmentRow,
  EmployeeAppointmentStats,
} from "@/dal/employees.dal";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useEmployeeDetailTabs } from "@/lib/hooks/use-employee-detail-tabs";
import {
  useEmployee,
  useEmployeeAppointmentStats,
  useEmployeeAppointments,
} from "@/lib/hooks/use-employees";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import { useEmployeesStore } from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

type EmployeeDetailPageClientProps = {
  employee?: Employee;
  initialStats?: EmployeeAppointmentStats;
  initialAppointments?: EmployeeAppointmentRow[];
};

export default function EmployeeDetailPageClient({
  employee: serverEmployee,
  initialStats,
  initialAppointments,
}: EmployeeDetailPageClientProps) {
  const { id: routeEmployeeId } = useParams<{ id: string }>();
  const employeeId = serverEmployee?.id ?? routeEmployeeId;
  const { profile, loading: authLoading } = useAuth();
  const { platformRole, loading: clinicLoading } = useActiveClinic();
  const employeeQuery = useEmployee(serverEmployee ?? employeeId);
  const statsQuery = useEmployeeAppointmentStats(employeeId, initialStats);
  const appointmentsQuery = useEmployeeAppointments(
    employeeId,
    initialAppointments,
  );
  const fetchEmployee = useEmployeesStore((state) => state.fetchEmployee);
  const fetchEmployeeStats = useEmployeesStore(
    (state) => state.fetchEmployeeStats,
  );
  const fetchEmployeeAppointments = useEmployeesStore(
    (state) => state.fetchEmployeeAppointments,
  );
  const { activeTab, setActiveTab } = useEmployeeDetailTabs();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";

  const refetch = () => {
    void fetchEmployee(employeeId);
    void fetchEmployeeStats(employeeId);
    void fetchEmployeeAppointments(employeeId);
  };

  const employee = employeeQuery.data;

  useTopbarBreadcrumb(
    employee
      ? {
          rootLabel: EMPLOYEE_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/employees",
          currentLabel: employee.full_name,
        }
      : null,
  );

  const employeeActionHandlers = {
    onEdit: () => setEditDialogOpen(true),
    onToggleStatus: () => setStatusDialogOpen(true),
  };

  useTopbarActions(
    employee
      ? {
          buttons: [getEmployeeDetailPrimaryAction(employeeActionHandlers)],
          menu: {
            sections: getEmployeeDetailMenuSections(
              employee,
              employeeActionHandlers,
            ),
            ariaLabel: EMPLOYEE_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if ((authLoading || clinicLoading || employeeQuery.isLoading) && !employee) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (employeeQuery.error) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto p-8">
        <BackButton
          fallbackHref="/employees"
          label={EMPLOYEE_DETAIL_COPY.back}
        />
        <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.load} />
      </div>
    );
  }
  if (!canManage) {
    return (
      <div className="p-8">
        <Notice
          tone="danger"
          message={EMPLOYEE_DETAIL_COPY.errors.permissions}
        />
      </div>
    );
  }
  if (!employee) {
    notFound();
  }

  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <EmployeeDetailHeader employee={employee} />

      <div className="flex flex-col gap-6 px-4 pb-8 lg:px-8">
        <EmployeeDetailTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div role="tabpanel">
          <EmployeeDetailTabContent
            activeTab={activeTab}
            employee={employee}
            stats={statsQuery.data ?? undefined}
            statsLoading={statsQuery.isLoading}
            statsError={statsQuery.error}
            appointments={appointments}
            appointmentsLoading={appointmentsQuery.isLoading}
            appointmentsError={appointmentsQuery.error}
          />
        </div>
      </div>

      <EmployeeEditDialog
        employee={employee}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={refetch}
      />

      <EmployeeStatusConfirmDialog
        employee={employee}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
