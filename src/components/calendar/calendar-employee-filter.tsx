"use client";

import { Users } from "lucide-react";
import { useMemo, useState } from "react";

import AppDialog from "@/components/ui/app-dialog";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useCalendarStore } from "@/stores/calendar-store";

export default function CalendarEmployeeFilter() {
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const employees = useEmployees();
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const selectedCount = employeeId ? 1 : 0;

  return (
    <>
      <div className="relative z-10 hidden min-w-0 md:inline-block md:min-w-[12rem] lg:min-w-[14rem]">
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
          className="w-full min-w-0"
        />
      </div>
      <button
        type="button"
        aria-label={CALENDAR_COPY.toolbar.filterEmployees}
        onClick={() => setSheetOpen(true)}
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas md:hidden motion-reduce:transition-none"
      >
        <Users size={18} />
        {selectedCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-on-primary">
            {selectedCount}
          </span>
        ) : null}
      </button>
      <AppDialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <AppSheetContent
          showClose
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface p-0 shadow-lg outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
        >
          <div className="border-b border-border-subtle px-6 py-4">
            <h2 className="text-lg font-medium text-ink">
              {CALENDAR_COPY.toolbar.filterEmployees}
            </h2>
          </div>
          <div className="p-4 pb-safe-bottom">
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
              className="w-full"
            />
          </div>
        </AppSheetContent>
      </AppDialog>
    </>
  );
}
