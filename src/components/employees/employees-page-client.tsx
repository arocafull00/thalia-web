"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import EmployeeInviteForm from "@/components/employees/components/employee-invite-form";
import EmployeesTable from "@/components/employees/components/employees-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import FilterPills from "@/components/ui/filter-pills";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useEmployeeInviteDialog } from "@/lib/hooks/use-employee-invite-dialog";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useSearch } from "@/lib/hooks/use-search";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { EmployeeRole } from "@/types/database.types";

const EMPLOYEE_FILTER_DEFAULTS = { role: "", status: "" };

const roleOptions: Array<{ value: EmployeeRole | ""; label: string }> = [
  { value: "", label: EMPLOYEES_COPY.roles.all },
  { value: "admin", label: EMPLOYEES_COPY.roles.admin },
  { value: "reception", label: EMPLOYEES_COPY.roles.reception },
  { value: "doctor", label: EMPLOYEES_COPY.roles.doctor },
  { value: "auxiliary", label: EMPLOYEES_COPY.roles.auxiliary },
];

const statusOptions = [
  { label: EMPLOYEES_COPY.filters.all, value: "" },
  { label: EMPLOYEES_COPY.filters.active, value: "active" },
  { label: EMPLOYEES_COPY.filters.inactive, value: "inactive" },
];

export default function EmployeesPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const employees = useEmployees();
  const debouncedSearch = useSearch();
  const { filters, setFilter } = useUrlFilters(EMPLOYEE_FILTER_DEFAULTS);
  const dialog = useEmployeeInviteDialog(() => setDialogOpen(false));
  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";
  const employeeData = useMemo(() => employees.data ?? [], [employees.data]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return employeeData.filter((employee) => {
      if (filters.role && employee.role !== filters.role) {
        return false;
      }

      if (filters.status === "active" && employee.active === false) {
        return false;
      }

      if (filters.status === "inactive" && employee.active !== false) {
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
  }, [debouncedSearch, employeeData, filters.role, filters.status]);

  const hasEmployees = employeeData.length > 0;
  const hasActiveFilters = Boolean(
    debouncedSearch.trim() || filters.role || filters.status,
  );
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
        <Notice tone="danger" message={EMPLOYEES_COPY.page.permissions} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            subtitle={EMPLOYEES_COPY.page.subtitle(employeeData.length)}
            title={EMPLOYEES_COPY.page.title}
          />
          <ActionButton
            title="Invitar personal"
            onClick={() => setDialogOpen(true)}
          />
        </div>
        <div className="mt-3 space-y-2">
          <FilterPills
            options={roleOptions}
            active={filters.role}
            onChange={(value) => setFilter("role", value)}
            ariaLabel={EMPLOYEES_COPY.filters.role}
          />
          <FilterPills
            options={statusOptions}
            active={filters.status}
            onChange={(value) => setFilter("status", value)}
            ariaLabel={EMPLOYEES_COPY.filters.status}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {employees.isLoading ? <SkeletonList /> : null}
        {employees.error ? (
          <Notice tone="danger" message={EMPLOYEES_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
            {EMPLOYEES_COPY.page.empty}
          </div>
        ) : null}
        {!showEmptyState && !employees.isLoading ? (
          <EmployeesTable
            employees={filteredEmployees}
            onRowClick={(id) => router.push(`/employees/${id}`)}
          />
        ) : null}
      </div>
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
