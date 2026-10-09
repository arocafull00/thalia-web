import { appointmentStatusColor } from "@/components/appointments/appointment-status-color";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import type { DaySegment } from "@/lib/dashboard-day";
import { appointmentStatusLabel } from "@/lib/format";

type DashboardDayProgressProps = {
  segments: DaySegment[];
  totalCount: number;
};

/**
 * Barra de la jornada en tres tramos: completadas, canceladas y no asistió.
 *
 * Toma los colores de `APPOINTMENT_STATUS_COLOR`, los mismos que las etiquetas
 * de estado del listado de abajo. Es lo que permite leer la barra sin volver a
 * la leyenda: el tramo de un color es el mismo color que esas filas.
 *
 * Lo que queda sin pintar es lo que falta por resolver, así que el hueco
 * también informa.
 */
export default function DashboardDayProgress({
  segments,
  totalCount,
}: DashboardDayProgressProps) {
  const filled = segments.filter((segment) => segment.count > 0);

  return (
    <div className="min-w-64 shrink-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-secondary">
          {DASHBOARD_COPY.day.label}
        </span>
        <span className="font-numeric text-sm font-medium tabular-nums text-ink">
          {DASHBOARD_COPY.day.total(totalCount)}
        </span>
      </div>

      <div
        role="img"
        aria-label={DASHBOARD_COPY.day.progressLabel(
          filled.map(
            (segment) =>
              `${segment.count} ${appointmentStatusLabel(segment.status).toLowerCase()}`,
          ),
          totalCount,
        )}
        className="flex h-1.5 gap-px overflow-hidden rounded-full bg-border"
      >
        {filled.map((segment) => (
          <span
            key={segment.status}
            style={{
              width: `${segment.percent}%`,
              backgroundColor: appointmentStatusColor(segment.status),
            }}
          />
        ))}
      </div>

      {/* Sin nada resuelto todavía la leyenda sobra: tres rótulos a cero son
          ruido a primera hora de la mañana. */}
      {filled.length === 0 ? null : (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {filled.map((segment) => (
            <li
              key={segment.status}
              className="flex items-center gap-1.5 text-xs text-ink-secondary"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: appointmentStatusColor(segment.status),
                }}
              />
              <span className="font-numeric tabular-nums">{segment.count}</span>
              {appointmentStatusLabel(segment.status).toLowerCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
