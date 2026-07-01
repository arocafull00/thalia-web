import {
  appointmentStatusLabel,
  formatAppointmentTimeRange,
  formatDate,
} from "@/lib/format";
import type { EmployeeAppointmentRow } from "@/stores/employees-store";

type EmployeeAppointmentRowProps = {
  appointment: EmployeeAppointmentRow;
};

export default function EmployeeAppointmentRow({
  appointment,
}: EmployeeAppointmentRowProps) {
  const statusLabel = appointmentStatusLabel(appointment.status);
  const isInactiveStatus =
    appointment.status === "cancelled" || appointment.status === "no_show";

  return (
    <tr className="border-b border-border-subtle">
      <td className="px-4 py-3 text-sm text-ink">
        {formatDate(appointment.starts_at)}
      </td>
      <td className="px-4 py-3 text-sm text-ink-secondary">
        {formatAppointmentTimeRange(appointment.starts_at, appointment.ends_at)}
      </td>
      <td className="px-4 py-3 text-sm text-ink">
        {appointment.patients?.full_name ?? "—"}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs uppercase tracking-wide ${isInactiveStatus ? "text-danger" : "text-ink-secondary"}`}
        >
          {statusLabel}
        </span>
      </td>
    </tr>
  );
}
