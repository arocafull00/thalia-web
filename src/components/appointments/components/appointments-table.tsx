"use client";

import { type CSSProperties, useMemo } from "react";

import { appointmentStatusColor } from "@/components/appointments/appointment-status-color";
import { buildAppointmentsColumns } from "@/components/appointments/components/appointments-columns";
import AppointmentsMobileList from "@/components/appointments/components/appointments-mobile-list";
import { DataTable } from "@/components/ui/data-table";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

type AppointmentsTableProps = {
  appointments: AppointmentWithRelations[];
  onRowClick: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  readOnly?: boolean;
  /**
   * Paginación en servidor: `appointments` es ya la página visible. Se omite
   * donde la tabla muestra una lista corta y completa, como el tab de citas de
   * la ficha del paciente.
   */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
  onDelete?: (appointment: AppointmentWithRelations) => void;
  onEdit?: (id: string) => void;
  canRespondToExternal?: boolean;
  respondingExternal?: boolean;
  onAccept?: (appointment: AppointmentWithRelations) => void;
  onReject?: (appointment: AppointmentWithRelations) => void;
};

export default function AppointmentsTable({
  appointments,
  onRowClick,
  onStatusChange,
  readOnly = false,
  pagination,
  onDelete,
  onEdit,
  canRespondToExternal = false,
  respondingExternal = false,
  onAccept,
  onReject,
}: AppointmentsTableProps) {
  const timezone = useActiveClinicTimezone();
  const actionHandlers = useMemo(
    () => ({ onAccept, onDelete, onEdit, onReject }),
    [onAccept, onDelete, onEdit, onReject],
  );
  const columns = useMemo(
    () =>
      buildAppointmentsColumns(
        onStatusChange,
        timezone,
        actionHandlers,
        readOnly,
        canRespondToExternal,
        respondingExternal,
      ),
    [
      actionHandlers,
      canRespondToExternal,
      onStatusChange,
      readOnly,
      respondingExternal,
      timezone,
    ],
  );

  return (
    <>
      <div className="md:hidden">
        <AppointmentsMobileList
          appointments={appointments}
          onRowClick={onRowClick}
          actionHandlers={actionHandlers}
          canRespondToExternal={canRespondToExternal}
          respondingExternal={respondingExternal}
        />
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={appointments}
          manualPagination={pagination}
          onRowClick={(appointment) => onRowClick(appointment.id)}
          getRowStyle={(appointment) =>
            ({
              "--glow": appointmentStatusColor(appointment.status),
            }) as CSSProperties
          }
        />
      </div>
    </>
  );
}
