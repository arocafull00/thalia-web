import PatientInfoSection from "@/components/patients/components/patient-info-section";
import PatientProfileHeader from "@/components/patients/components/patient-profile-header";
import PatientQuickActions from "@/components/patients/components/patient-quick-actions";
import type { Patient } from "@/types/database.types";

type PatientProfileSidebarProps = {
  patient: Patient;
  onEdit: () => void;
  onCreateAppointment: () => void;
};

export default function PatientProfileSidebar({
  patient,
  onEdit,
  onCreateAppointment,
}: PatientProfileSidebarProps) {
  return (
    <aside className="order-1 flex h-full min-h-0 flex-col border-b border-border-subtle lg:order-1 lg:border-r lg:border-b-0">
      <PatientProfileHeader patient={patient} />

      <div className="border-t border-border-subtle" />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PatientInfoSection patient={patient} />
      </div>

      <div className="mt-auto hidden shrink-0 border-t border-border-subtle lg:block">
        <PatientQuickActions
          patient={patient}
          onEdit={onEdit}
          onCreateAppointment={onCreateAppointment}
        />
      </div>
    </aside>
  );
}
