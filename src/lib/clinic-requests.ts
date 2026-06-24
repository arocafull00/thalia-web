export type PendingClinicRequest = {
  token: string;
  clinicName: string;
  role: string;
  expiresAt: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
