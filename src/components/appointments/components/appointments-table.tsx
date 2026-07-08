"use client";

import { useMemo } from "react";

import { buildAppointmentsColumns } from "@/components/appointments/components/appointments-columns";
import AppointmentsMobileList from "@/components/appointments/components/appointments-mobile-list";
import { DataTable } from "@/components/ui/data-table";
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
    <>
      <div className="md:hidden">
        <AppointmentsMobileList appointments={appointments} />
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={appointments}
          enableSorting
          onRowClick={(appointment) => onRowClick(appointment.id)}
        />
      </div>
    </>
  );
}
