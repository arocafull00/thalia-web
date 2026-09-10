"use client";

import { Calendar, Clock } from "lucide-react";

import {
  formatAppointmentDetailDay,
  formatAppointmentDuration,
  formatAppointmentTimeRange,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentHeaderDatetimeProps = {
  appointment: Pick<AppointmentWithRelations, "starts_at" | "ends_at">;
  timezone: string;
};

export default function AppointmentHeaderDatetime({
  appointment,
  timezone,
}: AppointmentHeaderDatetimeProps) {
  const day = formatAppointmentDetailDay(appointment.starts_at, timezone);
  const timeRange = formatAppointmentTimeRange(
    appointment.starts_at,
    appointment.ends_at,
    timezone,
  );
  const duration = formatAppointmentDuration(appointment);

  return (
    <div className="sm:ml-auto sm:shrink-0">
      <div className="flex flex-col gap-2 sm:items-end sm:text-right">
        <p className="flex items-center gap-2 text-xl font-semibold text-ink sm:text-2xl">
          <Calendar
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          {day}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end">
          <span className="inline-flex items-center gap-2 font-numeric text-xl font-semibold tabular-nums text-ink sm:text-2xl">
            <Clock
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            {timeRange}
          </span>
          <span className="text-base font-medium text-ink-secondary sm:text-lg">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
