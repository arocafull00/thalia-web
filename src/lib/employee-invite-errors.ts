import { FunctionsHttpError } from "@supabase/supabase-js";

const DEFAULT_EMPLOYEE_INVITE_ERROR =
  "No se pudo enviar la invitación. Inténtalo de nuevo.";

const EMPLOYEE_INVITE_ERROR_MESSAGES: Record<string, string> = {
  user_not_found: "No existe un usuario con ese email en el sistema",
  employee_not_found: "No existe un usuario con ese email en el sistema",
  "user not found": "No existe un usuario con ese email en el sistema",
  "employee not found": "No existe un usuario con ese email en el sistema",
  "email not found": "No existe un usuario con ese email en el sistema",
  "no user found": "No existe un usuario con ese email en el sistema",
  "usuario no encontrado": "No existe un usuario con ese email en el sistema",
  unauthorized: "Tu sesión ha caducado. Vuelve a iniciar sesión.",
  forbidden: "No tienes permisos para invitar personal a esta clínica.",
  clinic_id_required: "Selecciona una clínica antes de enviar la invitación.",
  "clinicid is required":
    "Selecciona una clínica antes de enviar la invitación.",
  email_required: "Introduce el email de la persona que quieres invitar.",
  "email is required": "Introduce el email de la persona que quieres invitar.",
  invalid_email: "Introduce un email válido.",
  "invalid email": "Introduce un email válido.",
  invalid_role: "El rol seleccionado no es válido.",
  "invalid role": "El rol seleccionado no es válido.",
  invitation_already_pending: "Este usuario ya tiene una invitación pendiente",
  user_already_member: "Este usuario ya pertenece a la clínica",
  "already a member": "Esta persona ya pertenece a la clínica.",
  "already invited": "Ya existe una invitación pendiente para ese email.",
  "duplicate key value": "Ya existe una invitación pendiente para ese email.",
  configuration_error:
    "El servicio de invitaciones no está disponible en este momento.",
  auth_lookup_failed:
    "No se pudo comprobar si el usuario existe. Inténtalo de nuevo.",
  membership_lookup_failed:
    "No se pudo comprobar la pertenencia a la clínica. Inténtalo de nuevo.",
  invitation_lookup_failed:
    "No se pudo comprobar si hay una invitación pendiente. Inténtalo de nuevo.",
  "supabase is not configured":
    "El servicio de invitaciones no está disponible en este momento.",
  invitation_failed: DEFAULT_EMPLOYEE_INVITE_ERROR,
  "invitation failed": DEFAULT_EMPLOYEE_INVITE_ERROR,
  "failed to send a request":
    "No se pudo conectar con el servicio de invitaciones.",
};

const EMPLOYEE_INVITE_STATUS_MESSAGES: Record<number, string> = {
  400: "No se pudo procesar la invitación. Revisa los datos introducidos.",
  401: "Tu sesión ha caducado. Vuelve a iniciar sesión.",
  403: "No tienes permisos para invitar personal a esta clínica.",
  404: "No existe un usuario con ese email en el sistema",
  429: "Se han enviado demasiadas invitaciones. Inténtalo más tarde.",
  500: "El servicio de invitaciones no está disponible en este momento.",
};

type EmployeeInviteErrorBody = {
  code?: unknown;
  error?: unknown;
  message?: unknown;
};

function normalizeErrorKey(value: string): string {
  return value.trim().toLowerCase();
}

function getStringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNestedMessage(value: unknown): string | null {
  const record =
    value && typeof value === "object"
      ? (value as { message?: unknown })
      : null;

  return getStringValue(record?.message);
}

function getErrorCandidates(body: unknown, sdkMessage: string): string[] {
  const response =
    body && typeof body === "object" ? (body as EmployeeInviteErrorBody) : {};

  return [
    getStringValue(response.code),
    getStringValue(response.error),
    getNestedMessage(response.error),
    getStringValue(response.message),
    getStringValue(body),
    sdkMessage,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeErrorKey);
}

function getDictionaryMessage(candidates: string[]): string | undefined {
  const entries = Object.entries(EMPLOYEE_INVITE_ERROR_MESSAGES);

  return candidates
    .flatMap((candidate) => [
      EMPLOYEE_INVITE_ERROR_MESSAGES[candidate],
      entries.find(([pattern]) => candidate.includes(pattern))?.[1],
    ])
    .find((message): message is string => Boolean(message));
}

async function readHttpErrorBody(error: Error): Promise<unknown> {
  return error instanceof FunctionsHttpError
    ? error.context.json().catch(() => null)
    : null;
}

export async function createEmployeeInviteError(error: Error): Promise<Error> {
  const body = await readHttpErrorBody(error);
  const candidates = getErrorCandidates(body, error.message);
  const status =
    error instanceof FunctionsHttpError ? error.context.status : undefined;
  const message =
    getDictionaryMessage(candidates) ??
    EMPLOYEE_INVITE_STATUS_MESSAGES[status ?? 0] ??
    DEFAULT_EMPLOYEE_INVITE_ERROR;

  return new Error(message);
}
