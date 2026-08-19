"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import EmployeeEditDialog from "@/components/employees/components/form/employee-edit-dialog";
import EmployeeInviteForm from "@/components/employees/components/form/employee-invite-form";
import EmployeeStatusConfirmDialog from "@/components/employees/components/form/employee-status-confirm-dialog";
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
import PageCard from "@/components/ui/page-card";
import PageEmptyState from "@/components/ui/page-empty-state";
import PageSurface from "@/components/ui/page-surface";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import type { EmployeePageResult } from "@/dal/employees.dal";
import {
  EMPLOYEES_PAGE_SIZE,
  parseEmployeeStatusFilter,
} from "@/lib/employee-pagination";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useEmployeeInviteDialog } from "@/lib/hooks/use-employee-invite-dialog";
import { useEmployeesPage } from "@/lib/hooks/use-employees";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { EmployeesPageQuery } from "@/stores/employees-store";

const EMPLOYEE_FILTER_DEFAULTS = { q: "", role: "", status: "", page: "" };

type EmployeesPageClientProps = {
  initialPage: EmployeePageResult;
  initialQuery: EmployeesPageQuery;
};

export default function EmployeesPageClient({
  initialPage,
  initialQuery,
}: EmployeesPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null,
  );
  const [statusEmployeeId, setStatusEmployeeId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { profile } = useAuth();
  const { platformRole } = useActiveClinic();
  const { filters, setFilter, setFilters } = useUrlFilters(
    EMPLOYEE_FILTER_DEFAULTS,
  );

  // Cualquier cambio de filtro, búsqueda incluida, vuelve a la página 1:
  // quedarse en la 5 tras filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );
  const dialog = useEmployeeInviteDialog(() => setDialogOpen(false));
  const canManage =
    platformRole === "owner" ||
    platformRole === "admin" ||
    profile?.role === "admin";

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      active: parseEmployeeStatusFilter(filters.status),
      page: pageIndex,
      role: filters.role,
      search: searchQuery,
    }),
    [filters.role, filters.status, pageIndex, searchQuery],
  );

  const employees = useEmployeesPage(pageFilters, {
    initialPage,
    initialQuery,
  });

  const editingEmployee = useMemo(
    () =>
      employees.employees.find((employee) => employee.id === editingEmployeeId),
    [editingEmployeeId, employees.employees],
  );
  const statusEmployee = useMemo(
    () =>
      employees.employees.find((employee) => employee.id === statusEmployeeId),
    [employees.employees, statusEmployeeId],
  );

  const hasActiveFilters = Boolean(
    searchQuery.trim() || filters.role || filters.status,
  );
  const showEmptyState =
    !employees.isLoading &&
    !employees.error &&
    !hasActiveFilters &&
    employees.total === 0;

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
      <PageSurface>
        <Notice tone="danger" message={EMPLOYEES_COPY.page.permissions} />
      </PageSurface>
    );
  }

  return (
    <div data-testid="employees-page" className="flex min-h-0 flex-1 flex-col">
      <PageCard
        filters={
          <EmployeesFilters
            role={filters.role}
            search={filters.q}
            status={filters.status}
            onRoleChange={(value) => setFilterAndResetPage("role", value)}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => setFilterAndResetPage("status", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        }
      >
        {employees.isLoading ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
        {employees.error ? (
          <Notice tone="danger" message={EMPLOYEES_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? (
          <PageEmptyState message={EMPLOYEES_COPY.page.empty} />
        ) : null}
        {!showEmptyState && !employees.isLoading ? (
          <EmployeesTable
            employees={employees.employees}
            onRowClick={handleRowClick}
            onEdit={handleRowClick}
            onToggleStatus={setStatusEmployeeId}
            pagination={{
              pageIndex,
              pageSize: EMPLOYEES_PAGE_SIZE,
              total: employees.total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
          />
        ) : null}
      </PageCard>
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
              <FORM_ACTION_ICONS.cancel
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {EMPLOYEE_INVITE_COPY.actions.cancel}
            </Button>
            <ActionButton
              icon={FORM_ACTION_ICONS.save}
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
      {statusEmployee ? (
        <EmployeeStatusConfirmDialog
          employee={statusEmployee}
          open
          onOpenChange={(open) => {
            if (!open) {
              setStatusEmployeeId(null);
            }
          }}
          onSuccess={() => setStatusEmployeeId(null)}
        />
      ) : null}
      <EmployeesFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        onApply={(updates) => setFilters({ ...updates, page: "" })}
        onClear={() => setFilters(EMPLOYEE_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Invitar personal" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
