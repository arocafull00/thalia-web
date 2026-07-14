import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientClinicalNotesPanelProps = {
  patient: Patient;
};

export default function PatientClinicalNotesPanel({
  patient,
}: PatientClinicalNotesPanelProps) {
  return (
    <div className="rounded-card border border-border/60 bg-surface p-4">
      <h2>{PATIENT_DETAIL_COPY.clinicalNotes.title}</h2>
      <p className="mt-4 text-sm whitespace-pre-wrap text-ink-secondary">
        {patient.notes?.trim()
          ? patient.notes
          : PATIENT_DETAIL_COPY.clinicalNotes.empty}
      </p>
    </div>
  );
}
