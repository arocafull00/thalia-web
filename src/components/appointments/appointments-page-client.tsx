"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDeleteDialog from "@/components/appointments/components/appointment-delete-dialog";
import AppointmentFilters from "@/components/appointments/components/appointment-filters";
import AppointmentFiltersSheet from "@/components/appointments/components/appointment-filters-sheet";
import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import { useAppointmentListDelete } from "@/components/appointments/hooks/use-appointment-list-delete";
import PageCard from "@/components/ui/page-card";
import PageEmptyState from "@/components/ui/page-empty-state";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { APPOINTMENTS_PAGE_SIZE } from "@/lib/appointment-pagination";
import { useAppointmentsPage } from "@/lib/hooks/use-appointments-page";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { notifySuccess } from "@/lib/sound";
import {
  useAppointmentsStore,
  type AppointmentsPageQuery,
} from "@/stores/appointments-store";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  Employee,
} from "@/types/database.types";

type AppointmentsPageClientProps = {
  initialAppointments: AppointmentWithRelations[];
  initialTotal: number;
  initialQuery: AppointmentsPageQuery;
  initialEmployees: Employee[];
  initialRange: {
    employeeId: string;
    from: string;
    to: string;
  };
};

export default function AppointmentsPageClient({
  initialAppointments,
  initialTotal,
  initialQuery,
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
  const appointmentDelete = useAppointmentListDelete();
  const filterDefaults = useMemo(
    () => ({
      // Vacío, y no `initialRange.employeeId`: al borrar un filtro de la URL,
      // `useUrlFilters` lo devuelve a su valor por defecto. Si el defecto fuera
      // el profesional con el que se cargó la página, elegir «Todos» volvería a
      // seleccionarlo y el filtro no se podría quitar.
      employeeId: "",
      // Las fechas sí son un defecto real: la semana en curso de la clínica,
      // que es lo que se muestra cuando la URL no trae rango.
      from: initialRange.from,
      page: "",
      q: "",
      status: "",
      to: initialRange.to,
    }),
    [initialRange.from, initialRange.to],
  );
  const { filters, setFilter, setFilters } = useUrlFilters(filterDefaults);

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

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // Parsear aquí con tope a 0 evita que un `?page=-3` escrito a mano llegue al
  // offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      employeeId: filters.employeeId,
      from: filters.from,
      page: pageIndex,
      search: searchQuery,
      status: filters.status,
      to: filters.to,
    }),
    [
      filters.employeeId,
      filters.from,
      filters.status,
      filters.to,
      pageIndex,
      searchQuery,
    ],
  );

  const { appointments, flatAppointments, showEmptyState, total } =
    useAppointmentsPage(pageFilters, {
      initialAppointments,
      initialTotal,
      initialQuery,
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

  useTopbarActions({
    buttons: [
      {
        title: appointments.isRefreshing
          ? APPOINTMENTS_COPY.page.refreshing
          : APPOINTMENTS_COPY.page.refresh,
        icon: RefreshCw,
        iconClassName: appointments.isRefreshing
          ? "animate-spin motion-reduce:animate-none"
          : undefined,
        disabled: appointments.isRefreshing,
        variant: "ghost",
        testId: "appointments-refresh-trigger",
        onClick: () => void appointments.refresh(),
      },
      {
        title: "Nueva cita",
        testId: "appointment-create-trigger",
        onClick: handleOpenCreateDialog,
      },
    ],
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
            onEmployeeIdChange={(value) =>
              setFilterAndResetPage("employeeId", value)
            }
            onFromChange={(value) => setFilterAndResetPage("from", value)}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => setFilterAndResetPage("status", value)}
            onToChange={(value) => setFilterAndResetPage("to", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        }
      >
        {appointments.isLoading && !appointments.data ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
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
            pagination={{
              pageIndex,
              pageSize: APPOINTMENTS_PAGE_SIZE,
              total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
            onEdit={handleRowClick}
            onDelete={appointmentDelete.openDialog}
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
      <AppointmentDeleteDialog
        open={Boolean(appointmentDelete.appointment)}
        onOpenChange={(open) => {
          if (!open) {
            appointmentDelete.closeDialog();
          }
        }}
        canRestoreStock={appointmentDelete.canRestoreStock}
        restoreStock={appointmentDelete.restoreStock}
        onRestoreStockChange={appointmentDelete.setRestoreStock}
        isPending={appointmentDelete.isPending}
        errorMessage={appointmentDelete.errorMessage ?? undefined}
        onConfirm={appointmentDelete.confirmDelete}
      />
      <AppointmentFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        initialEmployees={initialEmployees}
        onApply={(updates) => setFilters({ ...updates, page: "" })}
        onClear={() => setFilters(filterDefaults)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Nueva cita" onClick={handleOpenCreateDialog} />
    </div>
  );
}
