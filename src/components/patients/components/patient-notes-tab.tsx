import { Pencil } from "lucide-react";

import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientNotesTabProps = {
  patient: Patient;
  onEditNotes: () => void;
};

export default function PatientNotesTab({
  patient,
  onEditNotes,
}: PatientNotesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-medium text-ink">
          {PATIENT_DETAIL_COPY.clinicalNotes.title}
        </h2>
        <button
          type="button"
          aria-label={PATIENT_DETAIL_COPY.actions.edit}
          onClick={onEditNotes}
          className="flex size-9 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-4 text-sm whitespace-pre-wrap text-ink-secondary">
        {patient.notes?.trim()
          ? patient.notes
          : PATIENT_DETAIL_COPY.clinicalNotes.empty}
      </p>
    </div>
  );
}
