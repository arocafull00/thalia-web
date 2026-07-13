import type { PatientDetailTabId } from "@/lib/hooks/use-patient-detail-tabs";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

import PatientGalleryTab from "../gallery/patient-gallery-tab";
import PatientAppointmentsTab from "../tabs/patient-appointments-tab";
import PatientClinicalHistoryTab from "../tabs/patient-clinical-history-tab";
import PatientSummaryTab from "../tabs/patient-summary-tab";
import PatientTreatmentsTab from "../tabs/patient-treatments-tab";

type PatientDetailTabContentProps = {
  activeTab: PatientDetailTabId;
  patient: Patient;
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
  onEditNotes: () => void;
  onOpenUploader: () => void;
};

export default function PatientDetailTabContent({
  activeTab,
  patient,
  appointments,
  isLoading,
  error,
  onEditNotes,
  onOpenUploader,
}: PatientDetailTabContentProps) {
  if (activeTab === "summary") {
    return (
      <PatientSummaryTab
        patient={patient}
        appointments={appointments}
        isLoading={isLoading}
        error={error}
        onEditNotes={onEditNotes}
      />
    );
  }

  if (activeTab === "clinical-history") {
    return (
      <PatientClinicalHistoryTab
        appointments={appointments}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (activeTab === "treatments") {
    return <PatientTreatmentsTab appointments={appointments} />;
  }

  if (activeTab === "gallery") {
    return (
      <PatientGalleryTab patient={patient} onOpenUploader={onOpenUploader} />
    );
  }

  return <PatientAppointmentsTab appointments={appointments} />;
}
