import { APPOINTMENT_STATUS_COPY } from "@/copy/appointment-status-copy";
import type { AppointmentStockIssue } from "@/lib/appointment-stock";

export type ControlledAppointmentError = Error & {
  controlled: true;
  stockIssue?: AppointmentStockIssue;
};

type SupabaseErrorLike = {
  code?: string;
  details?: string;
  message?: string;
};

function controlledAppointmentError(
  message: string,
  stockIssue?: AppointmentStockIssue,
): ControlledAppointmentError {
  return Object.assign(new Error(message), {
    controlled: true as const,
    ...(stockIssue ? { stockIssue } : {}),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStockIssue(details: string | undefined) {
  if (!details) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(details);

    if (
      !isRecord(value) ||
      value.kind !== "appointment_stock_shortage" ||
      typeof value.inventoryItemId !== "string" ||
      typeof value.itemName !== "string" ||
      typeof value.availableStock !== "number" ||
      typeof value.requiredQuantity !== "number" ||
      (typeof value.unit !== "string" && value.unit !== null) ||
      typeof value.shortageCount !== "number"
    ) {
      return null;
    }

    return {
      inventoryItemId: value.inventoryItemId,
      itemName: value.itemName,
      availableStock: value.availableStock,
      requiredQuantity: value.requiredQuantity,
      unit: value.unit,
      shortageCount: value.shortageCount,
    } satisfies AppointmentStockIssue;
  } catch {
    return null;
  }
}

export function isControlledAppointmentError(
  error: Error,
): error is ControlledAppointmentError {
  return "controlled" in error && error.controlled === true;
}

export function isAppointmentStockError(
  cause: unknown,
): cause is ControlledAppointmentError & { stockIssue: AppointmentStockIssue } {
  return (
    cause instanceof Error &&
    isControlledAppointmentError(cause) &&
    cause.stockIssue !== undefined
  );
}

export function getAppointmentStatusErrorMessage(cause: unknown) {
  if (isAppointmentStockError(cause)) {
    return APPOINTMENT_STATUS_COPY.stockError(cause.stockIssue);
  }

  if (
    cause instanceof Error &&
    cause.message === APPOINTMENT_STATUS_COPY.legacyStockError
  ) {
    return cause.message;
  }

  return APPOINTMENT_STATUS_COPY.genericError;
}

export function toAppointmentError(cause: unknown): Error {
  const error = cause instanceof Error ? cause : new Error(String(cause));
  const supabaseError = cause as SupabaseErrorLike;

  if (supabaseError.code === "23505") {
    return controlledAppointmentError(
      "Ya existe una cita para ese profesional a esa hora.",
    );
  }

  if (supabaseError.code === "23P01") {
    return controlledAppointmentError(
      "El paciente ya tiene una cita programada para esa hora.",
    );
  }

  if (supabaseError.code === "P0001") {
    const stockIssue = parseStockIssue(supabaseError.details);

    if (stockIssue) {
      return controlledAppointmentError(
        APPOINTMENT_STATUS_COPY.stockError(stockIssue),
        stockIssue,
      );
    }
  }

  if (error.message.includes("Stock insuficiente")) {
    return controlledAppointmentError(APPOINTMENT_STATUS_COPY.legacyStockError);
  }

  return error;
}
