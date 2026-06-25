"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { ActionButton, Notice, PageHeader, SkeletonList } from "@/components/ui/primitives";
import { employeeRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useEmployeesUiStore } from "@/stores/employees-ui-store";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";
import type { EmployeeRole } from "@/types/database.types";

const SEARCH_DEBOUNCE_MS = 300;
const roles: Array<{ value: EmployeeRole | ""; label: string }> = [
  { value: "", label: "Todos" },
  { value: "admin", label: "Admin" },
  { value: "reception", label: "Recepción" },
  { value: "doctor", label: "Doctor" },
  { value: "auxiliary", label: "Auxiliar" },
];

export default function EmployeesPageClient() {
  const router = useRouter();
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const employees = useEmployees();
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const role = useEmployeesUiStore((state) => state.roleFilter);
  const setRoleFilter = useEmployeesUiStore((state) => state.setRoleFilter);
  const debouncedSearch = useDebouncedValue(topbarQuery, SEARCH_DEBOUNCE_MS);
  const canManage =
    platformRole === "owner" || platformRole === "admin" || profile?.role === "admin";
  const employeeData = employees.data ?? [];

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return employeeData.filter((employee) => {
      if (role && employee.role !== role) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const specialty = employee.specialty?.toLowerCase() ?? "";
      return (
        employee.full_name.toLowerCase().includes(normalizedSearch) ||
        specialty.includes(normalizedSearch)
      );
    });
  }, [debouncedSearch, employeeData, role]);

  const hasEmployees = employeeData.length > 0;
  const hasActiveFilters = Boolean(debouncedSearch.trim() || role);
  const showEmptyState =
    !employees.isLoading && !employees.error && !hasActiveFilters && !hasEmployees;

  if (!canManage) {
    return (
      <div className="p-8">
        <Notice tone="danger" message="Permisos insuficientes." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader subtitle={`${employeeData.length} profesionales registrados`} title="Personal" />
        <ActionButton title="Invitar personal" onClick={() => router.push("/settings/team")} />
      </div>
      <div className="flex flex-wrap gap-2">
        {roles.map((entry) => (
          <button
            key={entry.value || "all"}
            type="button"
            onClick={() => setRoleFilter(entry.value)}
            className={`rounded-full px-4 py-2 text-sm ${role === entry.value ? "bg-primary text-on-primary" : "bg-surface text-ink-secondary ring-1 ring-border"}`}
          >
            {entry.label}
          </button>
        ))}
      </div>
      {employees.isLoading ? <SkeletonList /> : null}
      {employees.error ? <Notice tone="danger" message="No se pudo cargar el personal." /> : null}
      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
          Todavía no hay personal registrado.
        </div>
      ) : null}
      {!showEmptyState && !employees.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr] gap-4 border-b border-border px-4 py-2 text-xs uppercase tracking-wide text-ink-muted">
            <span>Profesional</span>
            <span>Especialidad</span>
            <span>Rol</span>
            <span>Estado</span>
          </div>
          {filteredEmployees.map((employee) => (
            <button
              key={employee.id}
              type="button"
              onClick={() => router.push(`/employees/${employee.id}`)}
              className="grid w-full grid-cols-[1.4fr_1fr_0.8fr_0.7fr] gap-4 border-b border-border-subtle px-4 py-4 text-left transition hover:bg-canvas"
            >
              <span className="truncate font-medium text-ink">{employee.full_name}</span>
              <span className="truncate text-sm text-ink-secondary">{employee.specialty ?? "-"}</span>
              <span className="text-xs uppercase tracking-wide text-ink-secondary">
                {employeeRoleLabel(employee.role)}
              </span>
              <span className={`text-xs uppercase tracking-wide ${employee.active === false ? "text-danger" : "text-success"}`}>
                {employee.active === false ? "Inactivo" : "Activo"}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
