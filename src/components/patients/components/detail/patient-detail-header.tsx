"use client";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { formatAge } from "@/lib/format";
import type { Patient } from "@/types/database.types";

import PatientAvatarField from "../shared/patient-avatar-field";

type PatientDetailHeaderProps = {
  patient: Patient;
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
};

export default function PatientDetailHeader({
  patient,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
}: PatientDetailHeaderProps) {
  const initials = getProfileInitials(patient.full_name);
  const subtitleParts = [
    formatAge(patient.birth_date),
    patient.dni,
    patient.phone,
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center gap-4 px-4 pt-6 pb-6 lg:px-8">
      <PatientAvatarField
        displayUri={avatarDisplayUri}
        initials={initials}
        uploadPending={avatarUploadPending}
        onFileSelected={onAvatarFileSelected}
      />

      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold text-ink">{patient.full_name}</h1>
        {subtitleParts.length > 0 ? (
          <p className="text-sm text-ink-secondary">
            {subtitleParts.join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
