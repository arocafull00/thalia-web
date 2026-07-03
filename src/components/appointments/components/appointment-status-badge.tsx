import { appointmentStatusLabel } from "@/lib/format";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus | null;
};

const statusStyles: Record<
  AppointmentStatus,
  { container: string; text: string }
> = {
  scheduled: {
    container: "bg-primary-subtle",
    text: "text-primary",
  },
  confirmed: {
    container: "bg-success-subtle",
    text: "text-success",
  },
  in_progress: {
    container: "bg-warning-subtle",
    text: "text-warning",
  },
  completed: {
    container: "bg-success-subtle",
    text: "text-success",
  },
  cancelled: {
    container: "bg-danger-subtle",
    text: "text-danger",
  },
  no_show: {
    container: "bg-border",
    text: "text-ink-muted",
  },
};

export default function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const resolvedStatus = status ?? "scheduled";
  const styles = statusStyles[resolvedStatus];

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${styles.container} ${styles.text}`}
    >
      {appointmentStatusLabel(status)}
    </span>
  );
}
