import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { AppointmentWithRelations } from "@/types/database.types";

import PatientTimeline from "../detail/patient-timeline";

type PatientClinicalHistoryTabProps = {
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
};

export default function PatientClinicalHistoryTab({
  appointments,
  isLoading,
  error,
}: PatientClinicalHistoryTabProps) {
  return (
    <div className="space-y-4">
      <PatientTimeline
        appointments={appointments}
        isLoading={isLoading}
        error={error}
        heading={PATIENT_DETAIL_COPY.tabs.clinicalHistory}
        headingId="patient-clinical-history-heading"
      />
    </div>
  );
}
