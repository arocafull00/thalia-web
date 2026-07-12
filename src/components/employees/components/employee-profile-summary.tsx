import {
  CalendarDays,
  CheckCircle,
  Clock,
  Palette,
  XCircle,
} from "lucide-react";

import EmployeeStatCard from "@/components/employees/components/employee-stat-card";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { formatDate } from "@/lib/format";
import type { EmployeeAppointmentStats } from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

type EmployeeProfileSummaryProps = {
  employee: Employee;
  stats: EmployeeAppointmentStats | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
};

export default function EmployeeProfileSummary({
  employee,
  stats,
  isLoading,
  error,
}: EmployeeProfileSummaryProps) {
  const memberSince = employee.created_at
    ? formatDate(employee.created_at)
    : null;

  return (
    <section aria-labelledby="employee-summary-heading">
      <h2
        id="employee-summary-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {EMPLOYEE_DETAIL_COPY.sections.summary}
      </h2>
      <div className="space-y-4 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Palette
              className="size-4 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-ink-muted">
                {EMPLOYEE_DETAIL_COPY.fields.color}
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-ink">
                <span
                  className={`inline-block size-3.5 rounded-full border border-border ${employee.color ? "" : "bg-border"}`}
                  style={
                    employee.color
                      ? { backgroundColor: employee.color }
                      : undefined
                  }
                  aria-hidden="true"
                />
                {employee.color ?? "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays
              className="size-4 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-ink-muted">
                {EMPLOYEE_DETAIL_COPY.fields.memberSince}
              </p>
              <p className="text-sm text-ink">{memberSince ?? "—"}</p>
            </div>
          </div>
        </div>

        {isLoading ? <SkeletonList /> : null}

        {error ? (
          <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.stats} />
        ) : null}

        {stats ? (
          <div className="grid grid-cols-2 gap-3 divide-border-subtle border-t border-border-subtle pt-4">
            <EmployeeStatCard
              icon={CalendarDays}
              iconClassName="text-ink-muted"
              label={EMPLOYEE_DETAIL_COPY.stats.total}
              value={stats.total}
            />
            <EmployeeStatCard
              icon={CheckCircle}
              iconClassName="text-success"
              label={EMPLOYEE_DETAIL_COPY.stats.completed}
              value={stats.completed}
            />
            <EmployeeStatCard
              icon={Clock}
              iconClassName="text-warning"
              label={EMPLOYEE_DETAIL_COPY.stats.upcoming}
              value={stats.upcoming}
            />
            <EmployeeStatCard
              icon={XCircle}
              iconClassName="text-danger"
              label={EMPLOYEE_DETAIL_COPY.stats.cancelled}
              value={stats.cancelled}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
