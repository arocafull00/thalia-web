"use client";

import {
  CalendarDays,
  CheckCircle,
  Clock,
  Pencil,
  Phone,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";

import EmployeeAvatarDisplay from "@/components/employees/components/detail/employee-avatar-display";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { EmployeeAppointmentStats } from "@/dal/employees.dal";
import { employeeRoleLabel, formatDate } from "@/lib/format";
import type { Employee } from "@/types/database.types";

type EmployeeDetailSidebarProps = {
  employee: Employee;
  stats: EmployeeAppointmentStats | undefined;
  statsLoading: boolean;
  statsError: Error | null | undefined;
  onEdit: () => void;
  onToggleStatus: () => void;
};

export default function EmployeeDetailSidebar({
  employee,
  stats,
  statsLoading,
  statsError,
  onEdit,
  onToggleStatus,
}: EmployeeDetailSidebarProps) {
  const isInactive = employee.active === false;
  const memberSince = employee.created_at
    ? formatDate(employee.created_at)
    : null;

  const statRows = stats
    ? [
        {
          label: EMPLOYEE_DETAIL_COPY.stats.total,
          value: stats.total,
          icon: CalendarDays,
        },
        {
          label: EMPLOYEE_DETAIL_COPY.stats.completed,
          value: stats.completed,
          icon: CheckCircle,
        },
        {
          label: EMPLOYEE_DETAIL_COPY.stats.upcoming,
          value: stats.upcoming,
          icon: Clock,
        },
        {
          label: EMPLOYEE_DETAIL_COPY.stats.cancelled,
          value: stats.cancelled,
          icon: XCircle,
        },
      ]
    : [];

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border-subtle">
      <div className="px-6 py-8 text-center">
        <div className="mx-auto flex justify-center">
          <EmployeeAvatarDisplay employee={employee} />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-ink">
          {employee.full_name}
        </h1>
        {employee.specialty ? (
          <p className="mt-1 text-sm text-ink-secondary">{employee.specialty}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Badge variant="purple">{employeeRoleLabel(employee.role)}</Badge>
          <Badge variant={isInactive ? "danger" : "success"}>
            {isInactive
              ? EMPLOYEE_DETAIL_COPY.status.inactive
              : EMPLOYEE_DETAIL_COPY.status.active}
          </Badge>
        </div>
        {employee.phone ? (
          <p className="mt-2 text-sm text-ink-secondary">{employee.phone}</p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <dl className="divide-y divide-border-subtle">
          <div className="py-3">
            <dt className="text-xs text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.color}
            </dt>
            <dd className="mt-1 inline-flex items-center gap-2 text-sm text-ink">
              <span
                className={`inline-block size-3.5 rounded-full border border-border ${employee.color ? "" : "bg-border"}`}
                style={
                  employee.color ? { backgroundColor: employee.color } : undefined
                }
                aria-hidden="true"
              />
              {employee.color ?? "—"}
            </dd>
          </div>
          <div className="py-3">
            <dt className="text-xs text-ink-muted">
              {EMPLOYEE_DETAIL_COPY.fields.memberSince}
            </dt>
            <dd className="mt-1 text-sm text-ink">{memberSince ?? "—"}</dd>
          </div>
        </dl>

        {statsLoading ? (
          <div className="mt-6 border-t border-border-subtle pt-6">
            <SkeletonList />
          </div>
        ) : null}

        {statsError ? (
          <div className="mt-6 border-t border-border-subtle pt-6">
            <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.stats} />
          </div>
        ) : null}

        {statRows.length > 0 ? (
          <dl className="mt-6 divide-y divide-border-subtle border-t border-border-subtle">
            {statRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 py-3">
                <row.icon
                  className="size-4 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <dt className="text-xs text-ink-muted">{row.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-ink tabular-nums">
                    {row.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {employee.account_type === "internal" ? (
        <div className="mt-auto shrink-0 border-t border-border-subtle px-6 py-6">
          <div className="flex flex-col gap-2 [&>button]:w-full">
            <ActionButton
              title={EMPLOYEE_DETAIL_COPY.actions.edit}
              icon={Pencil}
              onClick={onEdit}
            />
            {employee.phone ? (
              <ActionButton
                title={EMPLOYEE_DETAIL_COPY.actions.call}
                icon={Phone}
                variant="ghost"
                onClick={() => {
                  window.location.href = `tel:${employee.phone}`;
                }}
              />
            ) : null}
            <ActionButton
              title={
                isInactive
                  ? EMPLOYEE_DETAIL_COPY.actions.activate
                  : EMPLOYEE_DETAIL_COPY.actions.deactivate
              }
              icon={isInactive ? UserCheck : UserX}
              variant="ghost"
              onClick={onToggleStatus}
            />
          </div>
        </div>
      ) : null}
    </aside>
  );
}
