"use client";

import { useMemo } from "react";

import AppointmentRow from "@/components/appointments/components/appointment-row";
import {
  getAppointmentRowActions,
  type AppointmentListActionHandlers,
} from "@/components/appointments/components/appointments-columns";
import { toAgendaAppointments } from "@/lib/calendar-agenda";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentsMobileListProps = {
  appointments: AppointmentWithRelations[];
  onRowClick: (id: string) => void;
  actionHandlers: AppointmentListActionHandlers;
};

export default function AppointmentsMobileList({
  appointments,
  onRowClick,
  actionHandlers,
}: AppointmentsMobileListProps) {
  const agendaAppointments = useMemo(
    () => toAgendaAppointments(appointments).toReversed(),
    [appointments],
  );
  const appointmentsById = useMemo(
    () =>
      new Map(appointments.map((appointment) => [appointment.id, appointment])),
    [appointments],
  );

  return (
    <div className="divide-y divide-border-subtle">
      {agendaAppointments.map((appointment) => (
        <AppointmentRow
          key={appointment.id}
          appointment={appointment}
          onClick={() => onRowClick(appointment.id)}
          actions={
            appointmentsById.has(appointment.id)
              ? getAppointmentRowActions(
                  appointmentsById.get(appointment.id)!,
                  actionHandlers,
                )
              : undefined
          }
        />
      ))}
    </div>
  );
}
