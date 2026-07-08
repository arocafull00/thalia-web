"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { useEmployees } from "@/lib/hooks/use-employees";

type AppointmentEmployeeFilterProps = {
  employeeId: string;
  onEmployeeIdChange: (value: string) => void;
};

export default function AppointmentEmployeeFilter({
  employeeId,
  onEmployeeIdChange,
}: AppointmentEmployeeFilterProps) {
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
    <div className="min-w-0">
      <AppSearchableCombobox
        value={employeeId || null}
        onValueChange={(value) => onEmployeeIdChange(value ?? "")}
        options={employeeOptions}
        placeholder={APPOINTMENTS_COPY.filters.all}
        searchPlaceholder={APPOINTMENTS_COPY.filters.searchEmployee}
        allowClear
        clearLabel={APPOINTMENTS_COPY.filters.all}
        variant="pill"
        triggerLeading={<Users size={16} />}
        className="w-full min-w-0"
      />
    </div>
  );
}
