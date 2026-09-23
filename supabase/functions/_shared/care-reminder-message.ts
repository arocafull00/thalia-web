export const CARE_REMINDER_TEMPLATE_DB_VALUE =
  "Tienes una cita [cuando] a las [hora] en [clínica].";

export type CareReminderInput = {
  clinicName: string;
  appointmentStartsAt: Date;
  sentAt: Date;
  timezone: string;
  confirmationUrl: string | null;
};

export type CareReminderTemplateVariables = {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
};

function formatDayKey(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(date);
}

function formatLongDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: timezone,
  }).format(date);
}

function dayOffset(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T12:00:00Z`);
  const to = new Date(`${toKey}T12:00:00Z`);
  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

export function formatAppointmentWhen(
  appointmentStartsAt: Date,
  sentAt: Date,
  timezone: string,
): string {
  const sentKey = formatDayKey(sentAt, timezone);
  const appointmentKey = formatDayKey(appointmentStartsAt, timezone);
  const offset = dayOffset(sentKey, appointmentKey);

  if (offset === 0) {
    return "hoy";
  }

  if (offset === 1) {
    return "mañana";
  }

  if (offset === 2) {
    return "pasado mañana";
  }

  return `el ${formatLongDate(appointmentStartsAt, timezone)}`;
}

export function buildCareReminderMessage(input: CareReminderInput): string {
  const cuando = formatAppointmentWhen(
    input.appointmentStartsAt,
    input.sentAt,
    input.timezone,
  );
  const hora = formatTime(input.appointmentStartsAt, input.timezone);
  const body = `Tienes una cita ${cuando} a las ${hora} en ${input.clinicName}.`;

  if (!input.confirmationUrl) {
    return body;
  }

  return `${body} Confírmala aquí: ${input.confirmationUrl}`;
}

export function buildCareReminderTemplateVariables(
  input: CareReminderInput,
): CareReminderTemplateVariables {
  const cuando = formatAppointmentWhen(
    input.appointmentStartsAt,
    input.sentAt,
    input.timezone,
  );
  const hora = formatTime(input.appointmentStartsAt, input.timezone);
  const token = input.confirmationUrl
    ? (input.confirmationUrl.split("/").pop() ?? "")
    : "";

  return {
    "1": cuando,
    "2": hora,
    "3": input.clinicName,
    "4": token,
  };
}
