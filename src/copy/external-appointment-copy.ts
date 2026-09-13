import type { ClinicNotificationType } from "@/types/database.types";

export const EXTERNAL_APPOINTMENT_COPY = {
  status: {
    pending: "Pendiente del profesional",
    rejected: "Rechazada",
  },
  actions: {
    accept: "Aceptar",
    reject: "Rechazar",
    accepting: "Aceptando…",
    rejecting: "Rechazando…",
    acceptAriaLabel: "Aceptar el hueco de esta cita",
    rejectAriaLabel: "Rechazar el hueco de esta cita",
  },
  rejection: {
    title: "¿Rechazar esta cita?",
    description:
      "La clínica verá que has rechazado el hueco y podrá volver a asignarlo.",
    confirm: "Rechazar",
    cancel: "Cancelar",
    pending: "Rechazando…",
  },
  overlap: {
    title: "¿Seguro que quieres aceptar esta cita?",
    description: (clinicName: string, range: string) =>
      `Se solapa con una cita en ${clinicName}, ${range}.`,
    confirm: "Aceptar igualmente",
    cancel: "Cancelar",
    pending: "Aceptando…",
  },
  toast: {
    accepted: "Cita aceptada.",
    rejected: "Cita rechazada.",
    error: "No se pudo responder a la cita.",
  },
  errors: {
    auth: "Debes iniciar sesión para responder a la cita.",
    clinic: "No hay una clínica activa.",
    invalid: "La respuesta a la cita no es válida.",
  },
} as const;

type ClinicNotificationCopy = {
  title: string;
  body: string;
  toast: string;
};

export const CLINIC_NOTIFICATION_COPY = {
  external_appointment_pending: {
    title: "Pendiente de aceptar",
    body: "La clínica solicita tu disponibilidad para esta cita.",
    toast: "Tienes una cita pendiente de aceptar.",
  },
  external_appointment_accepted: {
    title: "Aceptada",
    body: "El profesional ha aceptado el hueco.",
    toast: "Una cita ha sido aceptada.",
  },
  external_appointment_rejected: {
    title: "Rechazada",
    body: "El profesional ha rechazado el hueco.",
    toast: "Una cita ha sido rechazada.",
  },
  external_appointment_cancelled: {
    title: "Cita cancelada",
    body: "La clínica ha cancelado o reasignado esta cita.",
    toast: "Una cita asignada ha sido cancelada.",
  },
} satisfies Record<ClinicNotificationType, ClinicNotificationCopy>;

export const NOTIFICATIONS_COPY = {
  title: "Notificaciones",
  empty: "No hay notificaciones pendientes",
  appointmentsSection: "Citas",
  stockSection: "Stock bajo",
  view: "Ver",
  clinicFallback: "Clínica",
  bellAriaLabel: (count: number) =>
    count > 0
      ? `Notificaciones (${count > 99 ? "99+" : count})`
      : "Notificaciones",
  more: (count: number) => `+${count} más`,
  appointmentLinkAriaLabel: (title: string) =>
    `${title}: ver detalle de la cita`,
} as const;
