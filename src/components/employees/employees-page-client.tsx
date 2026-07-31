"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import EmployeeEditDialog from "@/components/employees/components/form/employee-edit-dialog";
import EmployeeInviteForm from "@/components/employees/components/form/employee-invite-form";
import EmployeesFilters from "@/components/employees/components/list/employees-filters";
import EmployeesFiltersSheet from "@/components/employees/components/list/employees-filters-sheet";
import EmployeesTable from "@/components/employees/components/list/employees-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useEmployeeInviteDialog } from "@/lib/hooks/use-employee-invite-dialog";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { Employee } from "@/types/database.types";

const EMPLOYEE_FILTER_DEFAULTS = { q: "", role: "", status: "" };

type EmployeesPageClientProps = {
  initialEmployees: Employee[];
};

export default function EmployeesPageClient({
  initialEmployees,
}: EmployeesPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const employees = useEmployees(initialEmployees);
  const { filters, setFilter, setFilters } = useUrlFilters(
    EMPLOYEE_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const dialog = useEmployeeInviteDialog(() => setDialogOpen(false));
  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";
  const employeeData = useMemo(() => employees.data ?? [], [employees.data]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

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
  }, [employeeData, filters.role, filters.status, searchQuery]);

  const editingEmployee = useMemo(
    () =>
      filteredEmployees.find((employee) => employee.id === editingEmployeeId),
    [editingEmployeeId, filteredEmployees],
  );

  const hasEmployees = employeeData.length > 0;
  const hasActiveFilters = Boolean(
    searchQuery.trim() || filters.role || filters.status,
  );
  const showEmptyState =
    !employees.isLoading &&
    !employees.error &&
    !hasActiveFilters &&
    !hasEmployees;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setDialogOpen(nextOpen);
  };

  const handleCancelInvite = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const handleEditDialogOpenChange = (nextOpen: boolean) => {
    setEditDialogOpen(nextOpen);
  };

  const handleRowClick = (id: string) => {
    setEditingEmployeeId(id);
    setEditDialogOpen(true);
  };

  useTopbarAction(
    canManage
      ? {
          title: "Invitar personal",
          testId: "employee-invite-trigger",
          onClick: () => setDialogOpen(true),
        }
      : null,
  );

  if (!canManage) {
    return (
      <div className="p-8">
        <Notice tone="danger" message={EMPLOYEES_COPY.page.permissions} />
      </div>
    );
  }

  return (
    <div data-testid="employees-page" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <EmployeesFilters
            role={filters.role}
            search={filters.q}
            status={filters.status}
            onRoleChange={(value) => setFilter("role", value)}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => setFilter("status", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
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
              onRowClick={handleRowClick}
            />
          ) : null}
        </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelInvite}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {EMPLOYEE_INVITE_COPY.actions.cancel}
            </Button>
            <ActionButton
              title={
                dialog.isPending
                  ? EMPLOYEE_INVITE_COPY.actions.saving
                  : EMPLOYEE_INVITE_COPY.actions.save
              }
              disabled={dialog.isPending}
              testId="employee-invite-submit"
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
      {editingEmployee ? (
        <EmployeeEditDialog
          employee={editingEmployee}
          open={editDialogOpen}
          onOpenChange={handleEditDialogOpenChange}
          onSuccess={() => {}}
          onViewDetail={() => {
            handleEditDialogOpenChange(false);
            router.push(`/employees/${editingEmployee.id}`);
          }}
        />
      ) : null}
      <EmployeesFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(EMPLOYEE_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Invitar personal" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
