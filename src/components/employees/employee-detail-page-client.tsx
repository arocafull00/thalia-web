"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

import EmployeeDetailActionsMenu from "@/components/employees/components/employee-detail-actions-menu";
import EmployeeEditDialog from "@/components/employees/components/employee-edit-dialog";
import EmployeeProfileSidebar from "@/components/employees/components/employee-profile-sidebar";
import EmployeeStatusConfirmDialog from "@/components/employees/components/employee-status-confirm-dialog";
import EmployeeTimeline from "@/components/employees/components/employee-timeline";
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
import { useEmployeesStore } from "@/stores/employees-store";

type EmployeeDetailPageClientProps = {
  employeeId: string;
};

export default function EmployeeDetailPageClient({
  employeeId,
}: EmployeeDetailPageClientProps) {
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const employeeQuery = useEmployee(employeeId);
  const statsQuery = useEmployeeAppointmentStats(employeeId);
  const appointmentsQuery = useEmployeeAppointments(employeeId);
  const fetchEmployee = useEmployeesStore((state) => state.fetchEmployee);
  const fetchEmployeeStats = useEmployeesStore(
    (state) => state.fetchEmployeeStats,
  );
  const fetchEmployeeAppointments = useEmployeesStore(
    (state) => state.fetchEmployeeAppointments,
  );
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

  if (employeeQuery.isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (employeeQuery.error) {
    return (
      <div className="p-8">
        <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.load} />
      </div>
    );
  }

  const employee = employeeQuery.data;

  if (!employee) {
    notFound();
  }

  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-4 lg:px-8">
        <BackButton
          fallbackHref="/employees"
          label={EMPLOYEE_DETAIL_COPY.back}
        />
        <EmployeeDetailActionsMenu
          employee={employee}
          onEdit={() => setEditDialogOpen(true)}
          onToggleStatus={() => setStatusDialogOpen(true)}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20%_1fr]">
        <EmployeeProfileSidebar
          employee={employee}
          stats={statsQuery.data ?? undefined}
          isLoading={statsQuery.isLoading}
          error={statsQuery.error}
          onEdit={() => setEditDialogOpen(true)}
          onToggleStatus={() => setStatusDialogOpen(true)}
        />
        <div className="order-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 lg:order-2 lg:px-6 lg:py-8">
          <EmployeeTimeline
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
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
