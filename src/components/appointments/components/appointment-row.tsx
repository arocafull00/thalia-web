import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatTime } from "@/lib/format";

type AppointmentRowProps = {
  appointment: AgendaAppointment;
};

export default function AppointmentRow({ appointment }: AppointmentRowProps) {
  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-canvas"
    >
      <span
        className={`w-1 shrink-0 self-stretch rounded-full ${appointment.employeeColor ? "" : "bg-border"}`}
        style={
          appointment.employeeColor
            ? { backgroundColor: appointment.employeeColor }
            : undefined
        }
        aria-hidden
      />
      <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-ink">
        {formatTime(appointment.startsAt)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {appointment.patientName}
        </p>
        <p className="truncate text-sm text-ink-secondary">
          {appointment.treatmentName}
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
    </Link>
  );
}
