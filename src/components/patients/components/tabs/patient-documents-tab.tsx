import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";

export default function PatientDocumentsTab() {
  return (
    <p className="py-8 text-center text-sm text-ink-secondary">
      {PATIENT_DETAIL_COPY.comingSoon.documents}
    </p>
  );
}
