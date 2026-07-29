"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentFilters from "@/components/appointments/components/appointment-filters";
import AppointmentFiltersSheet from "@/components/appointments/components/appointment-filters-sheet";
import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { useAppointmentsPage } from "@/lib/hooks/use-appointments-page";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type { AppointmentStatus } from "@/types/database.types";

const APPOINTMENT_FILTER_DEFAULTS = {
  employeeId: "",
  from: "",
  q: "",
  status: "",
  to: "",
};

export default function AppointmentsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    APPOINTMENT_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );

  const pageFilters = useMemo(
    () => ({
      employeeId: filters.employeeId,
      from: filters.from,
      search: searchQuery,
      status: filters.status,
      to: filters.to,
    }),
    [filters.employeeId, filters.from, filters.status, filters.to, searchQuery],
  );

  const { appointments, flatAppointments, showEmptyState } =
    useAppointmentsPage(pageFilters);

  // La fila del listado ya trae la cita completa (APPOINTMENT_LIST_SELECT),
  // así que el diálogo abre con el dato en mano y sin petición adicional.
  const editingAppointment = useMemo(
    () =>
      flatAppointments.find(
        (appointment) => appointment.id === editingAppointmentId,
      ) ?? null,
    [editingAppointmentId, flatAppointments],
  );

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  const handleOpenCreateDialog = useCallback(() => {
    setEditingAppointmentId(null);
    setDialogOpen(true);
  }, []);

  const handleRowClick = useCallback((id: string) => {
    setEditingAppointmentId(id);
    setDialogOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        await useAppointmentsStore
          .getState()
          .updateAppointmentStatus(id, status);
        notifySuccess("Estado de la cita actualizado.");
      } catch (cause) {
        notifyAppointmentStatusError(cause);
      }
    },
    [],
  );

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  useTopbarAction({
    title: "Nueva cita",
    testId: "appointment-create-trigger",
    onClick: handleOpenCreateDialog,
  });

  return (
    <div
      data-testid="appointments-page"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <AppointmentFilters
            employeeId={filters.employeeId}
            from={filters.from}
            search={searchQuery}
            status={filters.status}
            to={filters.to}
            onEmployeeIdChange={(value) => setFilter("employeeId", value)}
            onFromChange={(value) => setFilter("from", value)}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => setFilter("status", value)}
            onToChange={(value) => setFilter("to", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          {appointments.isLoading ? <SkeletonList /> : null}
          {appointments.error ? (
            <Notice tone="danger" message={APPOINTMENTS_COPY.page.loadError} />
          ) : null}
          {showEmptyState ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
              {APPOINTMENTS_COPY.page.empty}
            </div>
          ) : null}
          {!showEmptyState && !appointments.isLoading ? (
            <AppointmentsTable
              appointments={flatAppointments}
              onRowClick={handleRowClick}
              onStatusChange={handleStatusChange}
            />
          ) : null}
        </div>
      </div>
      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        appointment={editingAppointment}
        onViewDetail={
          editingAppointmentId
            ? () => {
                handleDialogOpenChange(false);
                router.push(`/appointments/${editingAppointmentId}`);
              }
            : undefined
        }
      />
      <AppointmentFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(APPOINTMENT_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Nueva cita" onClick={handleOpenCreateDialog} />
    </div>
  );
}
