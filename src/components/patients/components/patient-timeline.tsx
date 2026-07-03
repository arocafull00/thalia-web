import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import {
  ProfileTimeline,
  type ProfileTimelineItem,
} from "@/components/ui/profile/profile-timeline";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import {
  appointmentStatusLabel,
  appointmentStatusVariant,
  formatAppointmentMonthGroup,
  formatAppointmentTimeRange,
  formatDate,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type PatientTimelineProps = {
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
};

function mapAppointmentsToTimelineItems(
  appointments: AppointmentWithRelations[],
): ProfileTimelineItem[] {
  return appointments.map((appointment) => ({
    id: appointment.id,
    date: formatDate(appointment.starts_at),
    monthGroup: formatAppointmentMonthGroup(appointment.starts_at),
    time: formatAppointmentTimeRange(
      appointment.starts_at,
      appointment.ends_at,
    ),
    primary: appointment.employees?.full_name ?? "—",
    statusLabel: appointmentStatusLabel(appointment.status),
    statusVariant: appointmentStatusVariant(appointment.status),
  }));
}

const headingClassName =
  "shrink-0 border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance";

export default function PatientTimeline({
  appointments,
  isLoading,
  error,
}: PatientTimelineProps) {
  if (isLoading) {
    return (
      <section
        aria-labelledby="patient-history-heading"
        aria-busy="true"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="patient-history-heading" className={headingClassName}>
          {PATIENT_DETAIL_COPY.sections.history}
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
        aria-labelledby="patient-history-heading"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="patient-history-heading" className={headingClassName}>
          {PATIENT_DETAIL_COPY.sections.history}
        </h2>
        <div className="pt-6">
          <Notice tone="danger" message={PATIENT_DETAIL_COPY.errors.history} />
        </div>
      </section>
    );
  }

  return (
    <ProfileTimeline
      variant="integrated"
      headingId="patient-history-heading"
      heading={PATIENT_DETAIL_COPY.sections.history}
      items={mapAppointmentsToTimelineItems(appointments)}
      emptyMessage={PATIENT_DETAIL_COPY.history.empty}
    />
  );
}
