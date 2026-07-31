"use client";

import { useMemo } from "react";

import AppointmentDateRange, {
  formatAppointmentDateParam,
  getDefaultAppointmentDateRange,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import AppointmentEmployeeFilter from "@/components/appointments/components/appointment-employee-filter";
import AppointmentStatusFilter from "@/components/appointments/components/appointment-status-filter";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import type { Employee } from "@/types/database.types";

type AppointmentFiltersProps = {
  employeeId: string;
  from: string;
  initialEmployees?: Employee[];
  search: string;
  status: string;
  to: string;
  onEmployeeIdChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onToChange: (value: string) => void;
};

export default function AppointmentFilters({
  employeeId,
  from,
  initialEmployees,
  search,
  status,
  to,
  onEmployeeIdChange,
  onFromChange,
  onOpenSheet,
  onSearchChange,
  onStatusChange,
  onToChange,
}: AppointmentFiltersProps) {
  const defaults = useMemo(() => getDefaultAppointmentDateRange(), []);
  const rangeFrom = parseAppointmentDateParam(from, defaults.from);
  const rangeTo = parseAppointmentDateParam(to, defaults.to);

  return (
    <PageFiltersBar
      search={search}
      searchPlaceholder={APPOINTMENTS_COPY.filters.search}
      searchClearLabel={APPOINTMENTS_COPY.filters.searchClear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <div className="w-40 min-w-0 shrink-0">
        <AppointmentEmployeeFilter
          employeeId={employeeId}
          initialEmployees={initialEmployees}
          onEmployeeIdChange={onEmployeeIdChange}
        />
      </div>
      <div className="w-48 min-w-0 shrink-0">
        <AppointmentDateRange
          from={rangeFrom}
          to={rangeTo}
          onFromChange={(value) =>
            onFromChange(formatAppointmentDateParam(value))
          }
          onToChange={(value) => onToChange(formatAppointmentDateParam(value))}
        />
      </div>
      <div className="w-48 min-w-0 shrink-0">
        <AppointmentStatusFilter active={status} onChange={onStatusChange} />
      </div>
    </PageFiltersBar>
  );
}
