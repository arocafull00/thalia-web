import type { ClinicMembershipInvitationRole } from "@/types/database.types";

export type PendingClinicRequest = {
  token: string;
  clinicName: string;
  role: ClinicMembershipInvitationRole;
  expiresAt: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
