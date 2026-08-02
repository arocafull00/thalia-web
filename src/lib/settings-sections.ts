import type { ClinicMembershipRole } from "@/types/database.types";

export type SettingsSectionId = "usuario" | "clinica";

export const SETTINGS_SECTIONS: ReadonlyArray<{
  id: SettingsSectionId;
  href: string;
}> = [
  { id: "usuario", href: "/settings/usuario" },
  { id: "clinica", href: "/settings/clinica" },
];

export function canManageClinicSettings(
  role: ClinicMembershipRole | null,
): boolean {
  return role === "owner" || role === "admin" || role === null;
}

export function getSettingsSectionFromPathname(
  pathname: string,
): SettingsSectionId | null {
  if (pathname === "/settings") {
    return "usuario";
  }

  if (pathname.startsWith("/settings/clinica")) {
    return "clinica";
  }

  if (pathname.startsWith("/settings/usuario")) {
    return "usuario";
  }

  return null;
}
