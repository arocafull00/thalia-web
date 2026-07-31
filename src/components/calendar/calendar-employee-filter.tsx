"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useCalendarStore } from "@/stores/calendar-store";
import type { Employee } from "@/types/database.types";

type CalendarEmployeeFilterProps = {
  initialEmployees?: Employee[];
};

export default function CalendarEmployeeFilter({
  initialEmployees,
}: CalendarEmployeeFilterProps) {
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const employees = useEmployees(initialEmployees);

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

  return (
    <div className="relative z-10 hidden min-w-0 md:inline-block md:min-w-[12rem] lg:min-w-[14rem]">
      <AppSearchableCombobox
        value={employeeId}
        onValueChange={setEmployeeId}
        options={employeeOptions}
        placeholder={CALENDAR_COPY.filters.all}
        searchPlaceholder={CALENDAR_COPY.filters.searchEmployee}
        allowClear
        clearLabel={CALENDAR_COPY.filters.all}
        variant="pill"
        triggerLeading={<Users size={16} />}
        className="w-full min-w-0"
      />
    </div>
  );
}
