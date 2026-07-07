import FilterPills from "@/components/ui/filter-pills";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusFilterProps = {
  active: string;
  onChange: (value: string) => void;
};

const statusOptions: Array<{ label: string; value: AppointmentStatus | "" }> = [
  { label: APPOINTMENTS_COPY.filters.all, value: "" },
  { label: APPOINTMENTS_COPY.filters.scheduled, value: "scheduled" },
  { label: APPOINTMENTS_COPY.filters.confirmed, value: "confirmed" },
  { label: APPOINTMENTS_COPY.filters.inProgress, value: "in_progress" },
  { label: APPOINTMENTS_COPY.filters.completed, value: "completed" },
  { label: APPOINTMENTS_COPY.filters.cancelled, value: "cancelled" },
  { label: APPOINTMENTS_COPY.filters.noShow, value: "no_show" },
];

export default function AppointmentStatusFilter({
  active,
  onChange,
}: AppointmentStatusFilterProps) {
  return (
    <FilterPills
      options={statusOptions}
      active={active}
      onChange={onChange}
      ariaLabel={APPOINTMENTS_COPY.filters.status}
    />
  );
}
