"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useCalendarStore } from "@/stores/calendar-store";

export default function CalendarEmployeeFilter() {
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const employees = useEmployees();

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
    <div className="relative z-10 inline-block min-w-[200px]">
      <AppSearchableCombobox
        value={employeeId}
        onValueChange={setEmployeeId}
        options={employeeOptions}
        placeholder="Todos"
        searchPlaceholder="Buscar profesional"
        allowClear
        clearLabel="Todos"
        variant="pill"
        triggerLeading={<Users size={16} />}
        className="min-w-[200px]"
      />
    </div>
  );
}
