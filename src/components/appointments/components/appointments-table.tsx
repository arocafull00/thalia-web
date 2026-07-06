"use client";

import { useMemo } from "react";

import { buildAppointmentsColumns } from "@/components/appointments/components/appointments-columns";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsMobileColumns } from "@/lib/table-mobile-columns";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

type AppointmentsTableProps = {
  appointments: AppointmentWithRelations[];
  onRowClick: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
};

export default function AppointmentsTable({
  appointments,
  onRowClick,
  onStatusChange,
}: AppointmentsTableProps) {
  const columns = useMemo(
    () => buildAppointmentsColumns(onStatusChange),
    [onStatusChange],
  );

  return (
    <DataTable
      columns={columns}
      data={appointments}
      enableSorting
      mobileColumns={appointmentsMobileColumns}
      onRowClick={(appointment) => onRowClick(appointment.id)}
    />
  );
}
