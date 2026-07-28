"use client";

import { useMemo } from "react";

import AppointmentRow from "@/components/appointments/components/appointment-row";
import { toAgendaAppointments } from "@/lib/calendar-agenda";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentsMobileListProps = {
  appointments: AppointmentWithRelations[];
  onRowClick: (id: string) => void;
};

export default function AppointmentsMobileList({
  appointments,
  onRowClick,
}: AppointmentsMobileListProps) {
  const agendaAppointments = useMemo(
    () => toAgendaAppointments(appointments),
    [appointments],
  );

  return (
    <div className="divide-y divide-border-subtle">
      {agendaAppointments.map((appointment) => (
        <AppointmentRow
          key={appointment.id}
          appointment={appointment}
          onClick={() => onRowClick(appointment.id)}
        />
      ))}
    </div>
  );
}
