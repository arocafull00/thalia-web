import type { User } from "@supabase/supabase-js";

export const OWNER_REGISTRATION_STEP_COUNT = 3;
export const EMPLOYEE_REGISTRATION_STEP_COUNT = 1;

export function hasRegistrationProfile(user: User | null): boolean {
  if (!user) {
    return false;
  }

  const metadata = user.user_metadata;

  if (metadata.registration_profile_complete === true) {
    return true;
  }

  const fullName = metadata.full_name;

  return typeof fullName === "string" && fullName.trim().length > 0;
}

export function isOwnerRegistration(user: User | null): boolean {
  if (!user) {
    return false;
  }

  return user.user_metadata.intended_operational_role === "admin";
}

export function hasPendingTeamInvites(user: User | null): boolean {
  if (!user) {
    return false;
  }

  return user.user_metadata.registration_pending_invites === true;
}

export function buildOwnerProfileMetadata(fullName: string) {
  return {
    full_name: fullName.trim(),
    registration_profile_complete: true,
    intended_operational_role: "admin",
  };
}
