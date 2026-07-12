"use client";

import { getPatientDetailActions } from "@/components/patients/patient-detail-actions";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientDetailActionsMenuProps = {
  patient: Patient;
  onEdit: () => void;
  onCreateAppointment: () => void;
  onOpenGallery: () => void;
  secondaryOnly?: boolean;
  className?: string;
};

export default function PatientDetailActionsMenu({
  patient,
  onEdit,
  onCreateAppointment,
  onOpenGallery,
  secondaryOnly = false,
  className,
}: PatientDetailActionsMenuProps) {
  const allActions = getPatientDetailActions(patient, {
    onEdit,
    onCreateAppointment,
    onOpenGallery,
  });
  const actions = secondaryOnly ? allActions.slice(2) : allActions;

  return (
    <ProfileActionsMenu
      actions={actions}
      ariaLabel={PATIENT_DETAIL_COPY.moreActions}
      className={className}
    />
  );
}
