import type {
  ClinicMembershipRole,
  EmployeeAccountType,
} from "@/types/database.types";

const EXTERNAL_MUTATION_ERROR =
  "Los profesionales externos solo tienen acceso de lectura.";

export function isExternalAccount(accountType: EmployeeAccountType | null) {
  return accountType === "external";
}

export function canAccessBusiness(role: ClinicMembershipRole | null) {
  return role === "owner";
}

export function canMutateClinicalData(accountType: EmployeeAccountType | null) {
  return accountType !== "external";
}

export function assertCanMutateClinicalData(
  accountType: EmployeeAccountType | null,
) {
  if (!canMutateClinicalData(accountType)) {
    throw new Error(EXTERNAL_MUTATION_ERROR);
  }
}
