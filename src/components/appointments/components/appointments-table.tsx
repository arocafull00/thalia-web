"use client";

import { appointmentsColumns } from "@/components/appointments/components/appointments-columns";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsMobileColumns } from "@/lib/table-mobile-columns";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentsTableProps = {
  appointments: AppointmentWithRelations[];
  onRowClick: (id: string) => void;
};

export default function AppointmentsTable({
  appointments,
  onRowClick,
}: AppointmentsTableProps) {
  return (
    <DataTable
      columns={appointmentsColumns}
      data={appointments}
      enableSorting
      mobileColumns={appointmentsMobileColumns}
      onRowClick={(appointment) => onRowClick(appointment.id)}
    />
  );
}
