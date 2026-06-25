"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { useEmployees } from "@/lib/hooks/use-employees";
import { useCalendarStore } from "@/stores/calendar-store";

export default function CalendarEmployeeFilter() {
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const employees = useEmployees();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const activeEmployees = useMemo(
    () => (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return activeEmployees;
    }

    return activeEmployees.filter((employee) =>
      employee.full_name.toLowerCase().includes(normalizedSearch),
    );
  }, [activeEmployees, search]);

  const selectedEmployee = useMemo(
    () => activeEmployees.find((employee) => employee.id === employeeId) ?? null,
    [activeEmployees, employeeId],
  );

  const triggerLabel = selectedEmployee?.full_name ?? "Todos";

  return (
    <div ref={containerRef} className="relative z-10 inline-block min-w-[200px]">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-secondary"
          >
            {employeeId === null ? <Users size={16} /> : null}
            {selectedEmployee?.color ? (
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedEmployee.color }} />
            ) : null}
            {triggerLabel}
            <ChevronDown size={16} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-72 rounded-2xl border border-border bg-surface p-3 shadow-lg" sideOffset={8}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar profesional"
              className="mb-3 w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                setEmployeeId(null);
                setOpen(false);
                setSearch("");
              }}
              className="mb-2 w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-canvas"
            >
              Todos
            </button>
            {filteredEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => {
                  setEmployeeId(employee.id);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-canvas"
              >
                <span
                  className={`h-2 w-2 rounded-full ${employee.color ? "" : "bg-border"}`}
                  style={employee.color ? { backgroundColor: employee.color } : undefined}
                />
                {employee.full_name}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
