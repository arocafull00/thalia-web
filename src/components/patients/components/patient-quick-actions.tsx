"use client";

import { getPatientDetailActions } from "@/components/patients/patient-detail-actions";
import ProfileQuickActionButton from "@/components/ui/profile/profile-quick-action-button";
import type { Patient } from "@/types/database.types";

type PatientQuickActionsProps = {
  patient: Patient;
  onEdit: () => void;
  onCreateAppointment: () => void;
};

export default function PatientQuickActions({
  patient,
  onEdit,
  onCreateAppointment,
}: PatientQuickActionsProps) {
  const actions = getPatientDetailActions(patient, {
    onEdit,
    onCreateAppointment,
  });

  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      {actions.map((action) => (
        <ProfileQuickActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          variant={action.buttonVariant ?? "solid"}
          onClick={
            action.onClick ??
            (() => {
              if (action.href) {
                window.location.href = action.href;
              }
            })
          }
        />
      ))}
    </div>
  );
}
