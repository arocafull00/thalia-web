"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import EmployeeInviteForm from "@/components/employees/components/employee-invite-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useEmployeeInviteDialog } from "@/lib/hooks/use-employee-invite-dialog";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const employees = useEmployees();
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const role = useEmployeesUiStore((state) => state.roleFilter);
  const setRoleFilter = useEmployeesUiStore((state) => state.setRoleFilter);
  const debouncedSearch = useDebouncedValue(topbarQuery, SEARCH_DEBOUNCE_MS);
  const dialog = useEmployeeInviteDialog(() => setDialogOpen(false));
  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";
  const employeeData = useMemo(() => employees.data ?? [], [employees.data]);

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
    !employees.isLoading &&
    !employees.error &&
    !hasActiveFilters &&
    !hasEmployees;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

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
        <PageHeader
          subtitle={`${employeeData.length} profesionales registrados`}
          title="Personal"
        />
        <ActionButton
          title="Invitar personal"
          onClick={() => setDialogOpen(true)}
        />
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
      {employees.error ? (
        <Notice tone="danger" message="No se pudo cargar el personal." />
      ) : null}
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
              <span className="truncate font-medium text-ink">
                {employee.full_name}
              </span>
              <span className="truncate text-sm text-ink-secondary">
                {employee.specialty ?? "-"}
              </span>
              <span className="text-xs uppercase tracking-wide text-ink-secondary">
                {employeeRoleLabel(employee.role)}
              </span>
              <span
                className={`text-xs uppercase tracking-wide ${employee.active === false ? "text-danger" : "text-success"}`}
              >
                {employee.active === false ? "Inactivo" : "Activo"}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <AppDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>{EMPLOYEE_INVITE_COPY.title}</AppDialogTitle>
            <AppDialogDescription>
              {EMPLOYEE_INVITE_COPY.description}
            </AppDialogDescription>
          </AppDialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <EmployeeInviteForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
            />
          </div>
          <AppDialogFooter>
            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
            >
              {EMPLOYEE_INVITE_COPY.actions.cancel}
            </button>
            <ActionButton
              title={
                dialog.isPending
                  ? EMPLOYEE_INVITE_COPY.actions.saving
                  : EMPLOYEE_INVITE_COPY.actions.save
              }
              disabled={dialog.isPending}
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
    </div>
  );
}
