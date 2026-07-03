"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

import EmployeeEditDialog from "@/components/employees/components/employee-edit-dialog";
import EmployeeProfileSidebar from "@/components/employees/components/employee-profile-sidebar";
import EmployeeStatusConfirmDialog from "@/components/employees/components/employee-status-confirm-dialog";
import EmployeeTimeline from "@/components/employees/components/employee-timeline";
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
      <div className="shrink-0 px-8 pt-6 pb-4">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {EMPLOYEE_DETAIL_COPY.back}
        </Link>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[20%_1fr]">
        <EmployeeProfileSidebar
          employee={employee}
          stats={statsQuery.data ?? undefined}
          isLoading={statsQuery.isLoading}
          error={statsQuery.error}
          onEdit={() => setEditDialogOpen(true)}
          onToggleStatus={() => setStatusDialogOpen(true)}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8">
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
