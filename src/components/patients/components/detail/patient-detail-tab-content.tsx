import type { PatientDetailTabId } from "@/lib/hooks/use-patient-detail-tabs";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  Patient,
  PatientFile,
  PatientImage,
} from "@/types/database.types";

import PatientFilesTab from "../files/patient-files-tab";
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
  onDeleteFile: (file: PatientFile, onSuccess?: () => void) => void;
  onDeleteImage: (image: PatientImage) => void;
  onOpenUploader: () => void;
  onOpenFilesUploader: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>;
  readOnly?: boolean;
};

export default function PatientDetailTabContent({
  activeTab,
  patient,
  appointments,
  isLoading,
  error,
  onDeleteFile,
  onDeleteImage,
  onOpenUploader,
  onOpenFilesUploader,
  onStatusChange,
  readOnly = false,
}: PatientDetailTabContentProps) {
  if (activeTab === "summary") {
    return <PatientSummaryTab patient={patient} appointments={appointments} />;
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
      <PatientGalleryTab
        patient={patient}
        onDeleteImage={onDeleteImage}
        onOpenUploader={onOpenUploader}
        readOnly={readOnly}
      />
    );
  }

  if (activeTab === "files") {
    return (
      <PatientFilesTab
        patient={patient}
        onDelete={onDeleteFile}
        onOpenUploader={onOpenFilesUploader}
        readOnly={readOnly}
      />
    );
  }

  return (
    <PatientAppointmentsTab
      appointments={appointments}
      onStatusChange={onStatusChange}
      readOnly={readOnly}
    />
  );
}
