import Link from "next/link";

import AppointmentRow from "@/components/appointments/components/appointment-row";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import type { AgendaAppointment } from "@/lib/calendar-agenda";

type DashboardAgendaProps = {
  appointments: AgendaAppointment[];
  isLoading: boolean;
  error: Error | null | undefined;
};

export default function DashboardAgenda({
  appointments,
  isLoading,
  error,
}: DashboardAgendaProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <h2>{DASHBOARD_COPY.agenda.title}</h2>
        <Link
          href="/calendar"
          className="text-xs text-ink-muted hover:text-ink-secondary"
        >
          {DASHBOARD_COPY.agenda.viewCalendar}
        </Link>
      </div>
      <div className="divide-y divide-border-subtle">
        {appointments.map((appointment) => (
          <AppointmentRow key={appointment.id} appointment={appointment} />
        ))}
      </div>
      {!isLoading && appointments.length === 0 ? (
        <p className="py-4 text-sm text-ink-secondary">
          {DASHBOARD_COPY.agenda.empty}
        </p>
      ) : null}
      {isLoading ? <SkeletonList count={3} /> : null}
      {error ? (
        <Notice tone="danger" message={DASHBOARD_COPY.agenda.loadError} />
      ) : null}
    </section>
  );
}
