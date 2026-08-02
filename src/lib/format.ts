import {
  differenceInYears,
  format,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

import { CLINIC_TIME_ZONE } from "@/lib/constants";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  ClinicMembershipRole,
  EmployeeRole,
  InventoryMovementType,
  InvitationTokenRole,
  TransactionType,
} from "@/types/database.types";

function toClinicDate(value: string | Date) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseISO(value);
  }

  return toZonedTime(
    value instanceof Date ? value : new Date(value),
    CLINIC_TIME_ZONE,
  );
}

export function formatInputDate(value: string | Date) {
  return format(toClinicDate(value), "d MMM yyyy", { locale: es });
}

export function formatBirthDateWithAge(birthDate: string | null) {
  if (!birthDate) {
    return null;
  }

  const age = differenceInYears(new Date(), toClinicDate(birthDate));

  return `${formatInputDate(birthDate)} (${age} años)`;
}

export function formatAge(birthDate: string | null) {
  if (!birthDate) {
    return null;
  }

  const age = differenceInYears(new Date(), toClinicDate(birthDate));

  return `${age} años`;
}

export function formatPatientReferenceId(id: string, createdAt: string | null) {
  const year = createdAt
    ? toClinicDate(createdAt).getFullYear()
    : toClinicDate(new Date()).getFullYear();
  const suffix = id.replace(/-/g, "").slice(0, 4).toUpperCase();

  return `#PAC-${year}-${suffix}`;
}

export function formatAppointmentDay(value: string | Date) {
  return format(toClinicDate(value), "d", { locale: es });
}

export function formatAppointmentMonth(value: string | Date) {
  return format(toClinicDate(value), "MMM", { locale: es })
    .replace(".", "")
    .toUpperCase();
}

export function formatInputDateTime(value: string | Date) {
  return format(toClinicDate(value), "d MMM yyyy, HH:mm", { locale: es });
}

export function formatClinicDayKey(value: string | Date) {
  return format(toClinicDate(value), "yyyy-MM-dd");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    currency: "EUR",
    style: "currency",
  }).format(value);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    timeZone: CLINIC_TIME_ZONE,
  }).format(new Date(value));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: CLINIC_TIME_ZONE,
  }).format(new Date(value));
}

export function formatAppointmentReferenceId(id: string) {
  const compact = id.replace(/-/g, "").toUpperCase();

  return `#${compact.slice(0, 4)}-${compact.slice(4, 5)}`;
}

export function formatAppointmentDetailDay(value: string | Date) {
  return format(toClinicDate(value), "d MMMM", { locale: es });
}

export function formatAppointmentTimeRange(
  start: string | Date,
  end: string | Date,
) {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatAppointmentDuration(
  appointment: Pick<AppointmentWithRelations, "starts_at" | "ends_at">,
) {
  const minutes = Math.max(
    1,
    Math.round(
      (new Date(appointment.ends_at).getTime() -
        new Date(appointment.starts_at).getTime()) /
        60000,
    ),
  );
  return `${minutes} min`;
}

export function formatPatientLastVisitLabel(lastVisitAt: string | Date | null) {
  if (!lastVisitAt) {
    return null;
  }

  const distance = formatDistanceToNow(new Date(lastVisitAt), {
    addSuffix: false,
    locale: es,
  });

  return `Visitó hace ${distance}`;
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    timeZone: CLINIC_TIME_ZONE,
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Corta por caracteres y añade puntos suspensivos. Se usa donde el recorte
 * tiene que ser real y no solo visual, para que el texto largo no infle la
 * altura de una celda ni viaje entero al DOM.
 */
export function truncateText(value: string, maxLength: number) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function appointmentStatusLabel(status: AppointmentStatus | null) {
  if (status === "confirmed") {
    return "Confirmada";
  }

  if (status === "in_progress") {
    return "En sala";
  }

  if (status === "completed") {
    return "Completada";
  }

  if (status === "cancelled") {
    return "Cancelada";
  }

  if (status === "no_show") {
    return "No asistió";
  }

  return "Programada";
}

export function appointmentStatusVariant(status: AppointmentStatus | null) {
  if (status === "completed") {
    return "success";
  }

  if (status === "cancelled" || status === "no_show") {
    return "danger";
  }

  if (status === "in_progress") {
    return "warning";
  }

  return "default";
}

export function formatAppointmentMonthGroup(value: string | Date) {
  return format(toClinicDate(value), "MMM yyyy", { locale: es }).replace(
    ".",
    "",
  );
}

export function transactionTypeLabel(type: TransactionType) {
  return type === "income" ? "Ingreso" : "Gasto";
}

export function employeeRoleLabel(role: EmployeeRole) {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "reception") {
    return "Recepción";
  }

  if (role === "auxiliary") {
    return "Auxiliar";
  }

  return "Doctor";
}

export function clinicMembershipRoleLabel(role: ClinicMembershipRole) {
  if (role === "owner") return "Propietario";
  if (role === "admin") return "Administrador";
  if (role === "employee") return "Empleado";
  if (role === "external") return "Externo";
  return role;
}

export function invitationTokenRoleLabel(role: InvitationTokenRole | string) {
  if (role === "admin") {
    return "Administrador";
  }

  if (role === "external") {
    return "Externo";
  }

  if (role === "employee") {
    return "Empleado";
  }

  return role;
}

export function getTreatmentName(appointment: AppointmentWithRelations) {
  return (
    appointment.appointment_treatments[0]?.treatment?.name ?? "Sin tratamiento"
  );
}

export function inventoryMovementTypeLabel(type: InventoryMovementType) {
  if (type === "in") {
    return "Entrada";
  }

  if (type === "out") {
    return "Salida";
  }

  return "Ajuste";
}
