"use client";

import { patientsColumns } from "@/components/patients/components/patients-columns";
import { DataTable } from "@/components/ui/data-table";
import { patientsMobileColumns } from "@/lib/table-mobile-columns";
import type { Patient } from "@/types/database.types";

type PatientsTableProps = {
  patients: Patient[];
  emptyMessage?: string;
  onRowClick: (id: string) => void;
};

export default function PatientsTable({
  patients,
  emptyMessage,
  onRowClick,
}: PatientsTableProps) {
  return (
    <DataTable
      columns={patientsColumns}
      data={patients}
      enableSorting
      emptyMessage={emptyMessage ?? "No hay pacientes con ese criterio."}
      mobileColumns={patientsMobileColumns}
      onRowClick={(patient) => onRowClick(patient.id)}
    />
  );
}
