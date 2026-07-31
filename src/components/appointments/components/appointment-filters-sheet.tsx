"use client";

import { useMemo, useState } from "react";

import {
  formatAppointmentDateParam,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import { appointmentStatusOptions } from "@/components/appointments/components/appointment-status-filter";
import AppDateField from "@/components/ui/app-date-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FiltersSheet from "@/components/ui/filters-sheet";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { useEmployees } from "@/lib/hooks/use-employees";
import type { Employee } from "@/types/database.types";

type AppointmentFilters = {
  employeeId: string;
  from: string;
  to: string;
  status: string;
};

type AppointmentFiltersSheetProps = {
  open: boolean;
  filters: AppointmentFilters;
  initialEmployees?: Employee[];
  onApply: (updates: AppointmentFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function AppointmentFiltersSheet({
  open,
  filters,
  initialEmployees,
  onApply,
  onClear,
  onDismiss,
}: AppointmentFiltersSheetProps) {
  const employees = useEmployees(initialEmployees);
  const [pending, setPending] = useState<AppointmentFilters>(filters);

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const employeeOptions = useMemo(
    () =>
      activeEmployees.map((employee) => ({
        value: employee.id,
        label: employee.full_name,
        leading: (
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${employee.color ? "" : "bg-border"}`}
            style={
              employee.color ? { backgroundColor: employee.color } : undefined
            }
          />
        ),
      })),
    [activeEmployees],
  );

  const defaultRange = useMemo(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  }, []);

  const pendingFrom = parseAppointmentDateParam(
    pending.from,
    defaultRange.from,
  );
  const pendingTo = parseAppointmentDateParam(pending.to, defaultRange.to);

  const handleApply = () => {
    onApply(pending);
    onDismiss();
  };

  const handleClear = () => {
    onClear();
    onDismiss();
  };

  return (
    <FiltersSheet
      open={open}
      onDismiss={onDismiss}
      onApply={handleApply}
      onClear={handleClear}
      contentClassName="min-h-[70dvh]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {APPOINTMENTS_COPY.filters.employee}
        </p>
        <AppSearchableCombobox
          value={pending.employeeId || null}
          onValueChange={(v) =>
            setPending((prev) => ({ ...prev, employeeId: v ?? "" }))
          }
          options={employeeOptions}
          placeholder={APPOINTMENTS_COPY.filters.all}
          searchPlaceholder={APPOINTMENTS_COPY.filters.searchEmployee}
          allowClear
          clearLabel={APPOINTMENTS_COPY.filters.all}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">Rango de fechas</p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between gap-2 text-sm text-ink-secondary">
            <span>{APPOINTMENTS_COPY.filters.dateFrom}</span>
            <AppDateField
              value={pendingFrom}
              onChange={(v) =>
                setPending((prev) => ({
                  ...prev,
                  from: formatAppointmentDateParam(v),
                }))
              }
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-sm text-ink-secondary">
            <span>{APPOINTMENTS_COPY.filters.dateTo}</span>
            <AppDateField
              value={pendingTo}
              onChange={(v) =>
                setPending((prev) => ({
                  ...prev,
                  to: formatAppointmentDateParam(v),
                }))
              }
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {APPOINTMENTS_COPY.filters.status}
        </p>
        <AppSearchableCombobox
          value={pending.status || null}
          onValueChange={(v) =>
            setPending((prev) => ({ ...prev, status: v ?? "" }))
          }
          options={appointmentStatusOptions}
          placeholder={APPOINTMENTS_COPY.filters.all}
          searchPlaceholder={APPOINTMENTS_COPY.filters.status}
          allowClear
          clearLabel={APPOINTMENTS_COPY.filters.all}
        />
      </div>
    </FiltersSheet>
  );
}
