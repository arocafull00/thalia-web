import { Badge } from "@/components/ui/badge";
import { appointmentStatusLabel } from "@/lib/format";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus | null;
};

const statusVariants: Record<
  AppointmentStatus,
  "default" | "success" | "warning" | "danger" | "muted"
> = {
  scheduled: "default",
  confirmed: "success",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
  no_show: "muted",
};

export default function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const resolvedStatus = status ?? "scheduled";

  return (
    <Badge variant={statusVariants[resolvedStatus]}>
      {appointmentStatusLabel(status)}
    </Badge>
  );
}
