"use client";

import { useState } from "react";

import AppointmentRow from "@/components/appointments/components/appointment-row";
import CalendarDayDialog from "@/components/calendar/components/calendar-day-dialog";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { AgendaAppointment } from "@/lib/calendar-agenda";

type CalendarMobileMonthAppointmentsProps = {
  day: Date;
  dayLabel: string;
  appointments: AgendaAppointment[];
  onCreateAppointment: () => void;
};

export default function CalendarMobileMonthAppointments({
  day,
  dayLabel,
  appointments,
  onCreateAppointment,
}: CalendarMobileMonthAppointmentsProps) {
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  return (
    <section className="border-t border-border-subtle">
      <div className="flex items-center justify-between bg-canvas px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">
          {CALENDAR_COPY.mobileMonth.appointmentsTitle(dayLabel)}
        </h2>
        <button
          type="button"
          onClick={() => setDayDialogOpen(true)}
          className="text-xs uppercase tracking-wide text-ink-secondary hover:text-ink"
        >
          {CALENDAR_COPY.mobileMonth.viewDay}
        </button>
      </div>
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <p className="text-sm text-ink-secondary">
            {CALENDAR_COPY.mobileMonth.empty}
          </p>
          <ActionButton
            title={CALENDAR_COPY.toolbar.newAppointment}
            onClick={onCreateAppointment}
          />
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {appointments.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
      <CalendarDayDialog
        open={dayDialogOpen}
        day={day}
        appointments={appointments}
        onOpenChange={setDayDialogOpen}
      />
    </section>
  );
}
