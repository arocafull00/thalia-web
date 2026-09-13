import { FunctionsHttpError } from "@supabase/supabase-js";

import { CLINIC_INVITATION_COPY } from "@/copy/clinic-invitation-copy";

type InvitationErrorBody = {
  error?: unknown;
  message?: unknown;
};

const ERROR_CODE_ALIASES = {
  already_member_of_this_clinic: "already_member_of_clinic",
  employee_role_is_required: "employee_role_required",
  invitation_role_conflicts_with_the_global_account_type:
    "invitation_account_type_conflict",
  owners_cannot_join_other_clinics: "owner_cannot_join_other_clinics",
  user_already_belongs_to_a_clinic: "user_already_belongs_to_clinic",
} as const;

function normalize(value: string) {
  return value.trim().toLowerCase().replaceAll(" ", "_");
}

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export async function createClinicInvitationError(error: Error) {
  const body =
    error instanceof FunctionsHttpError
      ? await error.context.json().catch(() => null)
      : null;
  const response =
    body && typeof body === "object" ? (body as InvitationErrorBody) : null;
  const candidates = [
    getString(response?.error),
    getString(response?.message),
    error.message,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalize);
  const entry = Object.entries(CLINIC_INVITATION_COPY.errors).find(([code]) =>
    candidates.some((candidate) => candidate.includes(code)),
  );
  const alias = Object.entries(ERROR_CODE_ALIASES).find(([phrase]) =>
    candidates.some((candidate) => candidate.includes(phrase)),
  )?.[1];

  return new Error(
    entry?.[1] ??
      (alias ? CLINIC_INVITATION_COPY.errors[alias] : undefined) ??
      CLINIC_INVITATION_COPY.errors.default,
  );
}
