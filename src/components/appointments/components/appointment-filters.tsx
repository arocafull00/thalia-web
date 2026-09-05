"use client";

import { useMemo } from "react";

import AppointmentDateRange, {
  formatAppointmentDateParam,
  getDefaultAppointmentDateRange,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import AppointmentEmployeeFilter from "@/components/appointments/components/appointment-employee-filter";
import AppointmentStatusFilter from "@/components/appointments/components/appointment-status-filter";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
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
  const timezone = useActiveClinicTimezone();
  const defaults = useMemo(
    () => getDefaultAppointmentDateRange(timezone),
    [timezone],
  );
  const rangeFrom = parseAppointmentDateParam(from, defaults.from);
  const rangeTo = parseAppointmentDateParam(to, defaults.to);

  return (
    <PageFiltersBar
      search={search}
      searchLabel={APPOINTMENTS_COPY.filterLabels.search}
      searchPlaceholder={APPOINTMENTS_COPY.filters.search}
      searchClearLabel={APPOINTMENTS_COPY.filters.searchClear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <FilterField
        label={APPOINTMENTS_COPY.filterLabels.employee}
        className="w-40 shrink-0"
      >
        {({ controlId }) => (
          <AppointmentEmployeeFilter
            id={controlId}
            employeeId={employeeId}
            initialEmployees={initialEmployees}
            onEmployeeIdChange={onEmployeeIdChange}
          />
        )}
      </FilterField>
      <FilterField
        label={APPOINTMENTS_COPY.filterLabels.dateRange}
        className="w-48 shrink-0"
      >
        {({ controlId }) => (
          <AppointmentDateRange
            id={controlId}
            from={rangeFrom}
            to={rangeTo}
            onFromChange={(value) =>
              onFromChange(formatAppointmentDateParam(value))
            }
            onToChange={(value) =>
              onToChange(formatAppointmentDateParam(value))
            }
          />
        )}
      </FilterField>
      <FilterField
        label={APPOINTMENTS_COPY.filterLabels.status}
        className="w-48 shrink-0"
      >
        {({ controlId }) => (
          <AppointmentStatusFilter
            id={controlId}
            active={status}
            onChange={onStatusChange}
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
