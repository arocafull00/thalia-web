"use client";

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
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import type { AppointmentWithRelations } from "@/types/database.types";

type PatientTimelineProps = {
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
  heading?: string;
  headingId?: string;
};

function mapAppointmentsToTimelineItems(
  appointments: AppointmentWithRelations[],
  timezone: string,
): ProfileTimelineItem[] {
  return appointments.map((appointment) => ({
    id: appointment.id,
    date: formatDate(appointment.starts_at, timezone),
    monthGroup: formatAppointmentMonthGroup(appointment.starts_at, timezone),
    time: formatAppointmentTimeRange(
      appointment.starts_at,
      appointment.ends_at,
      timezone,
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
  heading = PATIENT_DETAIL_COPY.sections.history,
  headingId = "patient-history-heading",
}: PatientTimelineProps) {
  const timezone = useActiveClinicTimezone();
  if (isLoading) {
    return (
      <section
        aria-labelledby={headingId}
        aria-busy="true"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id={headingId} className={headingClassName}>
          {heading}
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
        aria-labelledby={headingId}
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id={headingId} className={headingClassName}>
          {heading}
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
      headingId={headingId}
      heading={heading}
      items={mapAppointmentsToTimelineItems(appointments, timezone)}
      emptyMessage={PATIENT_DETAIL_COPY.history.empty}
    />
  );
}
