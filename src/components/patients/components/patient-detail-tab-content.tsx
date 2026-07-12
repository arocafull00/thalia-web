import PatientAppointmentsTab from "@/components/patients/components/patient-appointments-tab";
import PatientClinicalHistoryTab from "@/components/patients/components/patient-clinical-history-tab";
import PatientSummaryTab from "@/components/patients/components/patient-summary-tab";
import PatientTreatmentsTab from "@/components/patients/components/patient-treatments-tab";
import type { PatientDetailTabId } from "@/lib/hooks/use-patient-detail-tabs";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

type PatientDetailTabContentProps = {
  activeTab: PatientDetailTabId;
  patient: Patient;
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
  onEditNotes: () => void;
};

export default function PatientDetailTabContent({
  activeTab,
  patient,
  appointments,
  isLoading,
  error,
  onEditNotes,
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

  return <PatientAppointmentsTab appointments={appointments} />;
}
