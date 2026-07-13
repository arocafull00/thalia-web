"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/ui/data-table";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { derivePatientTreatmentUsage } from "@/lib/patient-detail-stats";
import type { AppointmentWithRelations } from "@/types/database.types";

import { getPatientTreatmentsColumns } from "./patient-treatments-columns";

type PatientTreatmentsTabProps = {
  appointments: AppointmentWithRelations[];
};

export default function PatientTreatmentsTab({
  appointments,
}: PatientTreatmentsTabProps) {
  const treatmentUsage = useMemo(
    () => derivePatientTreatmentUsage(appointments),
    [appointments],
  );
  const columns = useMemo(() => getPatientTreatmentsColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={treatmentUsage}
        enableSorting
        emptyMessage={PATIENT_DETAIL_COPY.treatmentsTab.empty}
      />
    </div>
  );
}
