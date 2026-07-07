"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDateRange, {
  formatAppointmentDateParam,
  getDefaultAppointmentDateRange,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import AppointmentEmployeeFilter from "@/components/appointments/components/appointment-employee-filter";
import AppointmentStatusFilter from "@/components/appointments/components/appointment-status-filter";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { useAppointmentsPage } from "@/lib/hooks/use-appointments-page";
import { useSearch } from "@/lib/hooks/use-search";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type { AppointmentStatus } from "@/types/database.types";

const APPOINTMENT_FILTER_DEFAULTS = {
  employeeId: "",
  from: "",
  status: "",
  to: "",
};

export default function AppointmentsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedSearch = useSearch();
  const { filters, setFilter } = useUrlFilters(APPOINTMENT_FILTER_DEFAULTS);
  const defaults = useMemo(() => getDefaultAppointmentDateRange(), []);

  const pageFilters = useMemo(
    () => ({
      employeeId: filters.employeeId,
      from: filters.from,
      search: debouncedSearch,
      status: filters.status,
      to: filters.to,
    }),
    [
      debouncedSearch,
      filters.employeeId,
      filters.from,
      filters.status,
      filters.to,
    ],
  );

  const { appointments, dateRangeLabel, flatAppointments, showEmptyState } =
    useAppointmentsPage(pageFilters);

  const rangeFrom = parseAppointmentDateParam(filters.from, defaults.from);
  const rangeTo = parseAppointmentDateParam(filters.to, defaults.to);

  const handleStatusChange = useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        await useAppointmentsStore
          .getState()
          .updateAppointmentStatus(id, status);
        toast.success("Estado de la cita actualizado.");
      } catch {
        toast.error("No se pudo actualizar el estado de la cita.");
      }
    },
    [],
  );

  const handleFromChange = (value: Date) => {
    setFilter("from", formatAppointmentDateParam(value));
  };

  const handleToChange = (value: Date) => {
    setFilter("to", formatAppointmentDateParam(value));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            subtitle={dateRangeLabel}
            title={APPOINTMENTS_COPY.page.title}
          />
          <ActionButton
            title="Nueva cita"
            onClick={() => setDialogOpen(true)}
          />
        </div>
        <div className="mt-3 space-y-3">
          <AppointmentDateRange
            from={rangeFrom}
            to={rangeTo}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
          />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <AppointmentStatusFilter
              active={filters.status}
              onChange={(value) => setFilter("status", value)}
            />
            <AppointmentEmployeeFilter
              employeeId={filters.employeeId}
              onEmployeeIdChange={(value) => setFilter("employeeId", value)}
            />
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
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
            onRowClick={(id) => router.push(`/appointments/${id}`)}
            onStatusChange={handleStatusChange}
          />
        ) : null}
      </div>
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
