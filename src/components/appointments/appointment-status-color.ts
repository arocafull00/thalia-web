import type { AppointmentStatus } from "@/types/database.types";

/**
 * Color de cada estado de cita. Fuente única: lo consumen el punto del
 * selector de estado y el orbe de la tabla, que antes tenían mapas propios y
 * mostraban colores distintos para el mismo estado.
 *
 * Es decorativo: el estado legible sigue estando en su etiqueta, así que el
 * color nunca es el único canal de información.
 */
export const APPOINTMENT_STATUS_COLOR: Record<AppointmentStatus, string> = {
  scheduled: "#6366f1",
  confirmed: "#eab308",
  in_progress: "#f97316",
  completed: "#14b8a6",
  cancelled: "#f43f5e",
  no_show: "#64748b",
};

export function appointmentStatusColor(
  status: AppointmentStatus | null,
): string {
  return APPOINTMENT_STATUS_COLOR[status ?? "scheduled"];
}
