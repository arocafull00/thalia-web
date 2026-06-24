import {
  mapOperationalRoleToEmployeeRole,
  type OperationalRoleOption,
} from "@/lib/operational-role";
import type { EmployeeRole } from "@/types/database.types";

export type OwnerClinicFormValues = {
  clinicName: string;
  address: string;
  clinicPhone: string;
  fullName: string;
  operationalRole: OperationalRoleOption | null;
  specialty: string;
  personalPhone: string;
  brandColor: string;
};

export type CreateClinicPayload = {
  name: string;
  address: string | null;
  phone: string | null;
  specialty: string | null;
  fullName: string;
  operationalRole: EmployeeRole;
  color: string | null;
  personalPhone: string | null;
};

export function buildCreateClinicPayload(
  values: OwnerClinicFormValues,
): CreateClinicPayload | null {
  const name = values.clinicName.trim();
  const fullName = values.fullName.trim();

  if (!name || !fullName || !values.operationalRole) {
    return null;
  }

  return {
    name,
    address: values.address.trim() || null,
    phone: values.clinicPhone.trim() || null,
    specialty: values.specialty.trim() || null,
    fullName,
    operationalRole: mapOperationalRoleToEmployeeRole(values.operationalRole),
    color: values.brandColor || null,
    personalPhone: values.personalPhone.trim() || null,
  };
}

export type OwnerClinicOnlyValues = {
  clinicName: string;
  address: string;
  clinicPhone: string;
};

export function validateClinicOnlyForm(values: OwnerClinicOnlyValues): string | null {
  if (!values.clinicName.trim()) {
    return "Introduce el nombre de la clínica";
  }

  return null;
}

export function buildCreateClinicPayloadFromProfile(
  clinicValues: OwnerClinicOnlyValues,
  fullName: string,
): CreateClinicPayload | null {
  const name = clinicValues.clinicName.trim();
  const resolvedName = fullName.trim();

  if (!name || !resolvedName) {
    return null;
  }

  return {
    name,
    address: clinicValues.address.trim() || null,
    phone: clinicValues.clinicPhone.trim() || null,
    specialty: null,
    fullName: resolvedName,
    operationalRole: "admin",
    color: null,
    personalPhone: null,
  };
}

export function validateOwnerClinicForm(values: OwnerClinicFormValues): string | null {
  if (!values.clinicName.trim()) {
    return "Introduce el nombre de la clínica";
  }

  if (!values.fullName.trim()) {
    return "Introduce tu nombre completo";
  }

  if (!values.operationalRole) {
    return "Selecciona un rol";
  }

  return null;
}
