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
};

export default function AppointmentsTable({
  appointments,
  onRowClick,
  onStatusChange,
  pagination,
  onDelete,
  onEdit,
}: AppointmentsTableProps) {
  const timezone = useActiveClinicTimezone();
  const actionHandlers = useMemo(
    () => ({ onDelete, onEdit }),
    [onDelete, onEdit],
  );
  const columns = useMemo(
    () => buildAppointmentsColumns(onStatusChange, timezone, actionHandlers),
    [actionHandlers, onStatusChange, timezone],
  );

  return (
    <>
      <div className="md:hidden">
        <AppointmentsMobileList
          appointments={appointments}
          onRowClick={onRowClick}
          actionHandlers={actionHandlers}
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
