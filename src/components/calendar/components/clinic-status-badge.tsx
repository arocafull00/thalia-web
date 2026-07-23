import { Temporal } from "temporal-polyfill";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

function isClinicOpenNow(clinic: ClinicInfo): boolean {
  try {
    const now = Temporal.Now.zonedDateTimeISO(clinic.timezone);
    if (!clinic.open_days.includes(now.dayOfWeek)) return false;
    const time = `${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}`;
    return (
      time >= clinic.opening_time.substring(0, 5) &&
      time < clinic.closing_time.substring(0, 5)
    );
  } catch {
    return false;
  }
}

type ClinicStatusBadgeProps = {
  clinic: ClinicInfo | null;
};

export default function ClinicStatusBadge({ clinic }: ClinicStatusBadgeProps) {
  if (!clinic) return null;

  const isOpen = isClinicOpenNow(clinic);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isOpen
          ? "border-border-subtle bg-surface text-success"
          : "border-border-subtle bg-surface text-ink-muted"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-ink-muted"}`}
      />
      {isOpen
        ? CALENDAR_COPY.clinicStatus.open
        : CALENDAR_COPY.clinicStatus.closed}
    </span>
  );
}
