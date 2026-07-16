import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { appointmentStatusLabel } from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type DashboardRecentActivityProps = {
  appointments: AppointmentWithRelations[];
};

export default function DashboardRecentActivity({
  appointments,
}: DashboardRecentActivityProps) {
  const recent = appointments.slice(0, 3);

  return (
    <section className="space-y-4">
      <h2>{DASHBOARD_COPY.recentActivity.title}</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {DASHBOARD_COPY.recentActivity.empty}
        </p>
      ) : (
        <div className="divide-y divide-border-subtle">
          {recent.map((appointment) => (
            <div key={appointment.id} className="py-4">
              <p className="text-sm font-medium text-ink">
                Cita {appointmentStatusLabel(appointment.status)} -{" "}
                {appointment.patients?.full_name ?? "Paciente"}
              </p>
              <p className="mt-1 text-xs text-ink-muted">Hoy</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
