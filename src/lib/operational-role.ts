import type { EmployeeRole } from "@/types/database.types";

export type OperationalRoleOption = "director" | "especialista" | "recepcion";

export const operationalRoleOptions: { value: OperationalRoleOption; label: string }[] = [
  { value: "director", label: "Director/a" },
  { value: "especialista", label: "Especialista" },
  { value: "recepcion", label: "Recepción" },
];

export function mapOperationalRoleToEmployeeRole(role: OperationalRoleOption): EmployeeRole {
  if (role === "director") {
    return "admin";
  }

  if (role === "recepcion") {
    return "reception";
  }

  return "doctor";
}
