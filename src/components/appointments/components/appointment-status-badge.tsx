import { appointmentStatusColor } from "@/components/appointments/appointment-status-color";
import { appointmentStatusLabel } from "@/lib/format";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus | null;
};

/**
 * Etiqueta de estado con el color de ese estado.
 *
 * Antes repartía los ocho estados entre cinco variantes del `Badge`, así que
 * «Confirmada» y «Completada» salían del mismo verde y «Programada» y
 * «Pendiente» costaban de distinguir. Ahora toma el color de
 * `APPOINTMENT_STATUS_COLOR`, el mismo que ya usaban el punto del selector y el
 * orbe de la tabla: tres sitios que decían colores distintos del mismo estado y
 * ahora dicen el mismo.
 *
 * El relleno es el color diluido y el texto va en `ink`, en lugar del color a
 * plena saturación sobre blanco: con ocho colores, varios no llegarían al
 * contraste mínimo a este tamaño de letra. El punto lleva el color entero, que
 * es donde se distingue.
 *
 * El color nunca es el único canal: el nombre del estado está escrito al lado.
 */
export default function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const color = appointmentStatusColor(status);

  return (
    <span
      data-slot="badge"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-normal text-ink"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {appointmentStatusLabel(status)}
    </span>
  );
}
