"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentFilters from "@/components/appointments/components/appointment-filters";
import AppointmentFiltersSheet from "@/components/appointments/components/appointment-filters-sheet";
import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import AppointmentsPanelFooter from "@/components/appointments/components/appointments-panel-footer";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import PageCard from "@/components/ui/page-card";
import PageEmptyState from "@/components/ui/page-empty-state";
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
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  Employee,
} from "@/types/database.types";

type AppointmentsPageClientProps = {
  initialAppointments: AppointmentWithRelations[];
  initialAppointmentsKey: string;
  initialEmployees: Employee[];
  initialRange: {
    employeeId: string;
    from: string;
    to: string;
  };
};

export default function AppointmentsPageClient({
  initialAppointments,
  initialAppointmentsKey,
  initialEmployees,
  initialRange,
}: AppointmentsPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const filterDefaults = useMemo(
    () => ({
      employeeId: initialRange.employeeId,
      from: initialRange.from,
      q: "",
      status: "",
      to: initialRange.to,
    }),
    [initialRange.employeeId, initialRange.from, initialRange.to],
  );
  const { filters, setFilter, setFilters } = useUrlFilters(filterDefaults);
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
    useAppointmentsPage(pageFilters, {
      initialAppointments,
      initialAppointmentsKey,
      initialEmployees,
      initialRange,
    });

  const editingAppointment = useMemo(
    () =>
      flatAppointments.find(
        (appointment) => appointment.id === editingAppointmentId,
      ) ?? null,
    [editingAppointmentId, flatAppointments],
  );

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const handleOpenCreateDialog = () => {
    setEditingAppointmentId(null);
    setDialogOpen(true);
  };

  const handleRowClick = (id: string) => {
    setEditingAppointmentId(id);
    setDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await useAppointmentsStore.getState().updateAppointmentStatus(id, status);
      notifySuccess("Estado de la cita actualizado.");
    } catch (cause) {
      notifyAppointmentStatusError(cause);
    }
  };

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
      className="relative flex min-h-0 flex-1 flex-col"
    >
      {/* Diálogos y FAB quedan fuera de la tarjeta: el FAB es fixed y el
          overflow-hidden de la tarjeta lo recortaría. */}
      <PageCard
        filters={
          <AppointmentFilters
            employeeId={filters.employeeId}
            from={filters.from}
            initialEmployees={initialEmployees}
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
        }
        footer={
          !showEmptyState && appointments.data ? (
            <AppointmentsPanelFooter count={flatAppointments.length} />
          ) : null
        }
      >
        {appointments.isLoading && !appointments.data ? <SkeletonList /> : null}
        {appointments.error ? (
          <Notice tone="danger" message={APPOINTMENTS_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? (
          <PageEmptyState message={APPOINTMENTS_COPY.page.empty} />
        ) : null}
        {!showEmptyState && appointments.data ? (
          <AppointmentsTable
            appointments={flatAppointments}
            onRowClick={handleRowClick}
            onStatusChange={handleStatusChange}
          />
        ) : null}
      </PageCard>
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
        initialEmployees={initialEmployees}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(filterDefaults)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Nueva cita" onClick={handleOpenCreateDialog} />
    </div>
  );
}
