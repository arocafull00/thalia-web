export const ACTIVE_CLINIC_COOKIE_NAME = "thalia-active-clinic";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function writeActiveClinicCookie(clinicId: string | null) {
  if (typeof document === "undefined") {
    return;
  }

  if (!clinicId) {
    document.cookie = `${ACTIVE_CLINIC_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${ACTIVE_CLINIC_COOKIE_NAME}=${encodeURIComponent(clinicId)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}
