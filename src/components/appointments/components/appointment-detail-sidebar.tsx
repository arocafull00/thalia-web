import { Calendar, FileText } from "lucide-react";

import AppointmentDetailCard from "@/components/appointments/components/appointment-detail-card";
import AppointmentReminderRow from "@/components/appointments/components/appointment-reminder-row";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  formatAppointmentDetailDay,
  formatAppointmentTimeRange,
  formatDateTime,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentDetailSidebarProps = {
  appointment: AppointmentWithRelations;
};

export default function AppointmentDetailSidebar({
  appointment,
}: AppointmentDetailSidebarProps) {
  const notes = appointment.notes?.trim();

  return (
    <div className="flex flex-col gap-6">
      <AppointmentDetailCard
        icon={Calendar}
        title={APPOINTMENT_DETAIL_COPY.appointmentDetails}
      >
        <dl>
          <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-3">
            <dt className="text-sm text-ink-secondary">
              {APPOINTMENT_DETAIL_COPY.date}
            </dt>
            <dd className="text-right text-sm font-medium text-ink">
              {formatAppointmentDetailDay(appointment.starts_at)}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-3">
            <dt className="text-sm text-ink-secondary">
              {APPOINTMENT_DETAIL_COPY.time}
            </dt>
            <dd className="text-right text-sm font-medium text-ink">
              {formatAppointmentTimeRange(
                appointment.starts_at,
                appointment.ends_at,
              )}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-3">
            <dt className="text-sm text-ink-secondary">
              {APPOINTMENT_DETAIL_COPY.status}
            </dt>
            <dd className="text-right text-sm font-medium text-ink">
              <AppointmentStatusBadge status={appointment.status} />
            </dd>
          </div>
          {appointment.created_at ? (
            <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-3">
              <dt className="text-sm text-ink-secondary">
                {APPOINTMENT_DETAIL_COPY.created}
              </dt>
              <dd className="text-right text-sm font-medium text-ink">
                {formatDateTime(appointment.created_at)}
              </dd>
            </div>
          ) : null}
          <AppointmentReminderRow
            appointmentId={appointment.id}
            reminderSent={appointment.reminder_sent}
          />
        </dl>
      </AppointmentDetailCard>

      <AppointmentDetailCard
        icon={FileText}
        title={APPOINTMENT_DETAIL_COPY.notes}
      >
        <p className="whitespace-pre-wrap text-sm text-ink-secondary">
          {notes ? notes : APPOINTMENT_DETAIL_COPY.noNotes}
        </p>
      </AppointmentDetailCard>
    </div>
  );
}
