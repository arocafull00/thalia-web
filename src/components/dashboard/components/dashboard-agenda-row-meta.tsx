import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatCurrency } from "@/lib/format";

type DashboardAgendaRowMetaProps = {
  appointment: AgendaAppointment;
};

/**
 * Importe y estado al final de la fila.
 *
 * Van en columna y con un ancho mínimo fijo para que entre filas queden
 * alineados: con el ancho libre, cada etiqueta de estado mide distinto y el
 * importe baila de una fila a otra.
 */
export default function DashboardAgendaRowMeta({
  appointment,
}: DashboardAgendaRowMetaProps) {
  /*
   * El ingreso solo existe cuando la cita está completada: el trigger
   * `handle_appointment_completed` crea la transacción al pasar a ese estado.
   * En cualquier otro estado el importe es una previsión, y se rotula como tal
   * para no afirmar un ingreso que no está en finanzas.
   */
  const earned = appointment.status === "completed";

  return (
    <div className="flex w-28 shrink-0 flex-col items-end gap-1.5">
      {appointment.amount === null ? (
        <span className="font-numeric text-sm text-ink-muted">—</span>
      ) : (
        <span className="text-right leading-tight">
          <span
            className={`block font-numeric text-sm tabular-nums ${
              earned ? "font-medium text-success-text" : "text-ink-muted"
            }`}
          >
            {formatCurrency(appointment.amount)}
          </span>
          <span className="block text-[11px] text-ink-muted">
            {earned
              ? DASHBOARD_COPY.agenda.earned
              : DASHBOARD_COPY.agenda.expected}
          </span>
        </span>
      )}
      <AppointmentStatusBadge status={appointment.status} />
    </div>
  );
}
