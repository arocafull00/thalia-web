"use client";

import { getPatientDetailActions } from "@/components/patients/patient-detail-actions";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientDetailActionsMenuProps = {
  patient: Patient;
  onEdit: () => void;
  onCreateAppointment: () => void;
};

export default function PatientDetailActionsMenu({
  patient,
  onEdit,
  onCreateAppointment,
}: PatientDetailActionsMenuProps) {
  const actions = getPatientDetailActions(patient, {
    onEdit,
    onCreateAppointment,
  });

  return (
    <ProfileActionsMenu
      actions={actions}
      ariaLabel={PATIENT_DETAIL_COPY.moreActions}
      className="lg:hidden"
    />
  );
}
