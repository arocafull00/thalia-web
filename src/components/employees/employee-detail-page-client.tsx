"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import EmployeeDetailSidebar from "@/components/employees/components/detail/employee-detail-sidebar";
import EmployeeEditDialog from "@/components/employees/components/form/employee-edit-dialog";
import EmployeeStatusConfirmDialog from "@/components/employees/components/form/employee-status-confirm-dialog";
import EmployeeTimeline from "@/components/employees/components/history/employee-timeline";
import {
  getEmployeeDetailMenuSections,
  getEmployeeDetailPrimaryAction,
} from "@/components/employees/employee-detail-actions";
import PageSurface from "@/components/ui/page-surface";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  useEmployee,
  useEmployeeAppointmentStats,
  useEmployeeAppointments,
} from "@/lib/hooks/use-employees";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";

export default function EmployeeDetailPageClient() {
  const { id: routeEmployeeId } = useParams<{ id: string }>();
  const employeeId = routeEmployeeId;
  const { profile, loading: authLoading } = useAuth();
  const { platformRole, loading: clinicLoading } = useActiveClinic();
  const employeeQuery = useEmployee(employeeId);
  const statsQuery = useEmployeeAppointmentStats(employeeId);
  const appointmentsQuery = useEmployeeAppointments(employeeId);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";

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
          buttons:
            employee.account_type === "external"
              ? []
              : [getEmployeeDetailPrimaryAction(employeeActionHandlers)],
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
      <PageSurface busy>
        <SkeletonList />
      </PageSurface>
    );
  }

  if (employeeQuery.error && !employee) {
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
      <PageSurface>
        <Notice
          tone="danger"
          message={EMPLOYEE_DETAIL_COPY.errors.permissions}
        />
      </PageSurface>
    );
  }
  if (!employee) {
    notFound();
  }

  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-8 pt-6 pb-4">
        <BackButton
          fallbackHref="/employees"
          label={EMPLOYEE_DETAIL_COPY.back}
        />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[20%_1fr]">
        <EmployeeDetailSidebar
          employee={employee}
          stats={statsQuery.data ?? undefined}
          statsLoading={statsQuery.isLoading}
          statsError={statsQuery.error}
          onEdit={employeeActionHandlers.onEdit}
          onToggleStatus={employeeActionHandlers.onToggleStatus}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8">
          <EmployeeTimeline
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
          />
        </div>
      </div>

      {employee.account_type === "internal" ? (
        <EmployeeEditDialog
          employee={employee}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      ) : null}

      <EmployeeStatusConfirmDialog
        employee={employee}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
}
