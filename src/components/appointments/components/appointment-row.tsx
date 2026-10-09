"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { appointmentStatusColor } from "@/components/appointments/appointment-status-color";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import AppointmentStockButton from "@/components/appointments/components/appointment-stock-button";
import ExternalAppointmentResponseActions from "@/components/appointments/components/external-appointment-response-actions";
import ListRowActions from "@/components/ui/list-row-actions";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatTime } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";

type AppointmentRowProps = {
  appointment: AgendaAppointment;
  onClick?: () => void;
  prefetch?: boolean;
  actions?: ProfileAction[];
  respondingExternalId?: string | null;
  onAccept?: () => void;
  onReject?: () => void;
  /**
   * Contenido al final de la fila, antes de las acciones.
   *
   * Existe para que Inicio pueda añadir el estado y el importe sin que aparezcan
   * en el listado de Citas ni en la ficha del paciente, que comparten esta fila
   * y no los quieren.
   */
  trailing?: ReactNode;
  /**
   * De qué habla la marca de color de la izquierda.
   *
   * `"employee"` —por omisión— es el color del profesional, que es lo que
   * necesita el calendario para distinguir agendas. `"status"` la pinta del
   * color del estado, que es lo que pide Inicio: ahí todas las citas son del
   * día y lo que se busca de un vistazo es cuáles están hechas.
   */
  accent?: "employee" | "status";
};

export default function AppointmentRow({
  appointment,
  onClick,
  prefetch,
  actions,
  respondingExternalId = null,
  onAccept,
  onReject,
  trailing,
  accent = "employee",
}: AppointmentRowProps) {
  const timezone = useActiveClinicTimezone();
  const content = (
    <>
      {/*
        El color es decorativo en los dos modos: el estado legible sigue en su
        etiqueta y el profesional en su línea, así que nadie depende del color
        para entender la fila.
      */}
      <span
        className={`w-1 shrink-0 self-stretch rounded-full ${
          accent === "employee" && !appointment.employeeColor ? "bg-border" : ""
        }`}
        style={
          accent === "status"
            ? { backgroundColor: appointmentStatusColor(appointment.status) }
            : appointment.employeeColor
              ? { backgroundColor: appointment.employeeColor }
              : undefined
        }
        aria-hidden
      />
      <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-ink-muted">
        {formatTime(appointment.startsAt, timezone)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {appointment.patientName}
        </p>
        <p className="truncate text-sm text-ink-secondary">
          {appointment.treatmentName}
        </p>
        {appointment.status === "pending_external" ||
        appointment.status === "rejected_external" ? (
          <div className="mt-1">
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-4 transition-colors hover:bg-[var(--hover-overlay)]">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {content}
        </button>
      ) : (
        <Link
          href={`/appointments/${appointment.id}`}
          prefetch={prefetch}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {content}
        </Link>
      )}
      {trailing}
      <AppointmentStockButton issue={appointment.stockIssue} />
      {onAccept && onReject ? (
        <div className="order-last w-full pl-16">
          <ExternalAppointmentResponseActions
            disabled={respondingExternalId === appointment.id}
            onAccept={onAccept}
            onReject={onReject}
          />
        </div>
      ) : null}
      {actions ? (
        <ListRowActions
          actions={actions}
          label={APPOINTMENTS_COPY.list.actions.label}
          variant="menu"
        />
      ) : null}
    </div>
  );
}
