import { ChevronRight } from "lucide-react";
import Link from "next/link";

import AppointmentStockButton from "@/components/appointments/components/appointment-stock-button";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatTime } from "@/lib/format";

type AppointmentRowProps = {
  appointment: AgendaAppointment;
};

export default function AppointmentRow({ appointment }: AppointmentRowProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-4 transition-colors hover:bg-[var(--hover-overlay)]">
      <Link
        href={`/appointments/${appointment.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-ink-muted">
          {formatTime(appointment.startsAt)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {appointment.patientName}
          </p>
          <p className="truncate text-sm text-ink-secondary">
            {appointment.treatmentName}
          </p>
        </div>
      </Link>
      <AppointmentStockButton issue={appointment.stockIssue} />
      <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
    </div>
  );
}
