import PatientClinicalNotesPanel from "@/components/patients/components/patient-clinical-notes-panel";
import PatientTimeline from "@/components/patients/components/patient-timeline";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

type PatientSummaryTabProps = {
  patient: Patient;
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
  onEditNotes: () => void;
};

export default function PatientSummaryTab({
  patient,
  appointments,
  isLoading,
  error,
  onEditNotes,
}: PatientSummaryTabProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <PatientTimeline
          appointments={appointments}
          isLoading={isLoading}
          error={error}
          heading={PATIENT_DETAIL_COPY.sections.timeline}
          headingId="patient-timeline-heading"
        />
      </div>
      <PatientClinicalNotesPanel patient={patient} onEditNotes={onEditNotes} />
    </div>
  );
}
