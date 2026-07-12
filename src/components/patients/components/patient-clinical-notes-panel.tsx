import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientClinicalNotesPanelProps = {
  patient: Patient;
  onEditNotes: () => void;
};

export default function PatientClinicalNotesPanel({
  patient,
  onEditNotes,
}: PatientClinicalNotesPanelProps) {
  return (
    <div className="rounded-card border border-border/60 bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2>{PATIENT_DETAIL_COPY.clinicalNotes.title}</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={PATIENT_DETAIL_COPY.actions.edit}
          onClick={onEditNotes}
        >
          <Pencil className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
      <p className="mt-4 text-sm whitespace-pre-wrap text-ink-secondary">
        {patient.notes?.trim()
          ? patient.notes
          : PATIENT_DETAIL_COPY.clinicalNotes.empty}
      </p>
    </div>
  );
}
