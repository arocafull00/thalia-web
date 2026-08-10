"use client";

import { useMemo } from "react";

import {
  buildPatientsColumns,
  getPatientRowActions,
} from "@/components/patients/components/list/patients-columns";
import { DataTable } from "@/components/ui/data-table";
import ListRowActions from "@/components/ui/list-row-actions";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { patientsMobileColumns } from "@/lib/table-mobile-columns";
import type { Patient } from "@/types/database.types";

type PatientsTableProps = {
  patients: Patient[];
  emptyMessage?: string;
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function PatientsTable({
  patients,
  emptyMessage,
  onRowClick,
  onEdit,
}: PatientsTableProps) {
  const actionHandlers = useMemo(() => ({ onEdit }), [onEdit]);
  const columns = useMemo(
    () => buildPatientsColumns(actionHandlers),
    [actionHandlers],
  );

  return (
    <DataTable
      columns={columns}
      data={patients}
      enableSorting
      emptyMessage={emptyMessage ?? "No hay pacientes con ese criterio."}
      mobileColumns={patientsMobileColumns}
      renderMobileActions={(patient) => (
        <ListRowActions
          actions={getPatientRowActions(patient, actionHandlers)}
          label={PATIENTS_COPY.list.actions.label}
          variant="menu"
        />
      )}
      onRowClick={(patient) => onRowClick(patient.id)}
    />
  );
}
