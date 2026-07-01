"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

import EmployeeAppointmentRow from "@/components/employees/components/employee-appointment-row";
import EmployeeEditDialog from "@/components/employees/components/employee-edit-dialog";
import EmployeeStatCard from "@/components/employees/components/employee-stat-card";
import EmployeeStatusConfirmDialog from "@/components/employees/components/employee-status-confirm-dialog";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { employeeRoleLabel } from "@/lib/format";
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

  const isInactive = employee.active === false;
  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/employees"
            className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {EMPLOYEE_DETAIL_COPY.back}
          </Link>
          <h1 className="text-2xl font-semibold text-ink">
            {employee.full_name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            title={EMPLOYEE_DETAIL_COPY.actions.edit}
            onClick={() => setEditDialogOpen(true)}
          />
          <ActionButton
            title={
              isInactive
                ? EMPLOYEE_DETAIL_COPY.actions.activate
                : EMPLOYEE_DETAIL_COPY.actions.deactivate
            }
            variant="ghost"
            onClick={() => setStatusDialogOpen(true)}
          />
        </div>
      </div>

      <section aria-labelledby="employee-general-heading">
        <h2
          id="employee-general-heading"
          className="mb-4 text-lg font-medium text-ink"
        >
          {EMPLOYEE_DETAIL_COPY.sections.general}
        </h2>
        <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.role}
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {employeeRoleLabel(employee.role)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.specialty}
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {employee.specialty ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.phone}
            </dt>
            <dd className="mt-1 text-sm text-ink">{employee.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.color}
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm text-ink">
              <span
                className={`inline-block size-4 rounded-full border border-border ${employee.color ? "" : "bg-border"}`}
                style={
                  employee.color
                    ? { backgroundColor: employee.color }
                    : undefined
                }
                aria-hidden="true"
              />
              {employee.color ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.status}
            </dt>
            <dd className="mt-1">
              <span
                className={`text-xs font-medium uppercase tracking-wide ${isInactive ? "text-danger" : "text-success"}`}
              >
                {isInactive
                  ? EMPLOYEE_DETAIL_COPY.status.inactive
                  : EMPLOYEE_DETAIL_COPY.status.active}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="employee-stats-heading">
        <h2
          id="employee-stats-heading"
          className="mb-4 text-lg font-medium text-ink"
        >
          {EMPLOYEE_DETAIL_COPY.sections.stats}
        </h2>
        {statsQuery.isLoading ? <SkeletonList /> : null}
        {statsQuery.error ? (
          <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.stats} />
        ) : null}
        {statsQuery.data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EmployeeStatCard
              label={EMPLOYEE_DETAIL_COPY.stats.total}
              value={statsQuery.data.total}
            />
            <EmployeeStatCard
              label={EMPLOYEE_DETAIL_COPY.stats.completed}
              value={statsQuery.data.completed}
            />
            <EmployeeStatCard
              label={EMPLOYEE_DETAIL_COPY.stats.upcoming}
              value={statsQuery.data.upcoming}
            />
            <EmployeeStatCard
              label={EMPLOYEE_DETAIL_COPY.stats.cancelled}
              value={statsQuery.data.cancelled}
            />
          </div>
        ) : null}
      </section>

      <section aria-labelledby="employee-history-heading">
        <h2
          id="employee-history-heading"
          className="mb-4 text-lg font-medium text-ink"
        >
          {EMPLOYEE_DETAIL_COPY.sections.history}
        </h2>
        {appointmentsQuery.isLoading ? <SkeletonList /> : null}
        {appointmentsQuery.error ? (
          <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.history} />
        ) : null}
        {!appointmentsQuery.isLoading && !appointmentsQuery.error ? (
          appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
              {EMPLOYEE_DETAIL_COPY.history.empty}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <table className="w-full text-left">
                <caption className="sr-only">
                  {EMPLOYEE_DETAIL_COPY.history.caption}
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                    <th scope="col" className="px-4 py-2">
                      {EMPLOYEE_DETAIL_COPY.history.columns.date}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {EMPLOYEE_DETAIL_COPY.history.columns.time}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {EMPLOYEE_DETAIL_COPY.history.columns.patient}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {EMPLOYEE_DETAIL_COPY.history.columns.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <EmployeeAppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </section>

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
