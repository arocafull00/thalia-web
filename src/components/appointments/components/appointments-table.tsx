"use client";

import type { SortingState } from "@tanstack/react-table";
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

const APPOINTMENTS_INITIAL_SORTING: SortingState = [{ desc: true, id: "date" }];

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
  const timezone = useActiveClinicTimezone();
  const columns = useMemo(
    () => buildAppointmentsColumns(onStatusChange, timezone),
    [onStatusChange, timezone],
  );

  return (
    <>
      <div className="md:hidden">
        <AppointmentsMobileList
          appointments={appointments}
          onRowClick={onRowClick}
        />
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={appointments}
          enableSorting
          initialSorting={APPOINTMENTS_INITIAL_SORTING}
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
