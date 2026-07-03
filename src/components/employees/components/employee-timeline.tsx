import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import {
  ProfileTimeline,
  type ProfileTimelineItem,
} from "@/components/ui/profile/profile-timeline";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import {
  appointmentStatusLabel,
  appointmentStatusVariant,
  formatAppointmentMonthGroup,
  formatAppointmentTimeRange,
  formatDate,
} from "@/lib/format";
import type { EmployeeAppointmentRow } from "@/stores/employees-store";

type EmployeeTimelineProps = {
  appointments: EmployeeAppointmentRow[];
  isLoading: boolean;
  error: Error | null | undefined;
};

function mapAppointmentsToTimelineItems(
  appointments: EmployeeAppointmentRow[],
): ProfileTimelineItem[] {
  return appointments.map((appointment) => ({
    id: appointment.id,
    date: formatDate(appointment.starts_at),
    monthGroup: formatAppointmentMonthGroup(appointment.starts_at),
    time: formatAppointmentTimeRange(
      appointment.starts_at,
      appointment.ends_at,
    ),
    primary: appointment.patients?.full_name ?? "—",
    statusLabel: appointmentStatusLabel(appointment.status),
    statusVariant: appointmentStatusVariant(appointment.status),
  }));
}

const headingClassName =
  "shrink-0 border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance";

export default function EmployeeTimeline({
  appointments,
  isLoading,
  error,
}: EmployeeTimelineProps) {
  if (isLoading) {
    return (
      <section
        aria-labelledby="employee-history-heading"
        aria-busy="true"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="employee-history-heading" className={headingClassName}>
          {EMPLOYEE_DETAIL_COPY.sections.history}
        </h2>
        <div className="pt-6">
          <SkeletonList />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-labelledby="employee-history-heading"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="employee-history-heading" className={headingClassName}>
          {EMPLOYEE_DETAIL_COPY.sections.history}
        </h2>
        <div className="pt-6">
          <Notice tone="danger" message={EMPLOYEE_DETAIL_COPY.errors.history} />
        </div>
      </section>
    );
  }

  return (
    <ProfileTimeline
      variant="integrated"
      headingId="employee-history-heading"
      heading={EMPLOYEE_DETAIL_COPY.sections.history}
      items={mapAppointmentsToTimelineItems(appointments)}
      emptyMessage={EMPLOYEE_DETAIL_COPY.history.empty}
    />
  );
}
