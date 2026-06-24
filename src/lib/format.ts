import { differenceInYears, format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type {
  AppointmentStatus,
  AppointmentWithRelations,
  EmployeeRole,
  InventoryMovementType,
  InvitationTokenRole,
  TransactionType,
} from "@/types/database.types";

function toLocalDate(value: string | Date) {
  if (value instanceof Date) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseISO(value);
  }

  return new Date(value);
}

export function formatInputDate(value: string | Date) {
  return format(toLocalDate(value), "d MMM yyyy", { locale: es });
}

export function formatBirthDateWithAge(birthDate: string | null) {
  if (!birthDate) {
    return null;
  }

  const age = differenceInYears(new Date(), toLocalDate(birthDate));

  return `${formatInputDate(birthDate)} (${age} años)`;
}

export function formatPatientReferenceId(id: string, createdAt: string | null) {
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const suffix = id.replace(/-/g, "").slice(0, 4).toUpperCase();

  return `#PAC-${year}-${suffix}`;
}

export function formatAppointmentDay(value: string | Date) {
  return format(toLocalDate(value), "d", { locale: es });
}

export function formatAppointmentMonth(value: string | Date) {
  return format(toLocalDate(value), "MMM", { locale: es }).replace(".", "").toUpperCase();
}

export function formatInputDateTime(value: string | Date) {
  return format(toLocalDate(value), "d MMM yyyy, HH:mm", { locale: es });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", { currency: "EUR", style: "currency" }).format(value);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

export function formatAppointmentReferenceId(id: string) {
  const compact = id.replace(/-/g, "").toUpperCase();

  return `#${compact.slice(0, 4)}-${compact.slice(4, 5)}`;
}

export function formatAppointmentDetailDay(value: string | Date) {
  return format(toLocalDate(value), "d MMMM", { locale: es });
}

export function formatAppointmentTimeRange(start: string | Date, end: string | Date) {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatAppointmentDuration(
  appointment: Pick<AppointmentWithRelations, "starts_at" | "ends_at">,
) {
  const minutes = Math.max(
    1,
    Math.round(
      (new Date(appointment.ends_at).getTime() - new Date(appointment.starts_at).getTime()) / 60000,
    ),
  );
  return `${minutes} min`;
}

export function formatPatientLastVisitLabel(lastVisitAt: string | Date | null) {
  if (!lastVisitAt) {
    return null;
  }

  const distance = formatDistanceToNow(toLocalDate(lastVisitAt), { addSuffix: false, locale: es });

  return `Visitó hace ${distance}`;
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
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

export function inventoryMovementTypeLabel(type: InventoryMovementType) {
  if (type === "in") {
    return "Entrada";
  }

  if (type === "out") {
    return "Salida";
  }

  return "Ajuste";
}
