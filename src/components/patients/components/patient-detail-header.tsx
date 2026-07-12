"use client";

import { Images } from "lucide-react";
import Image from "next/image";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { formatAge } from "@/lib/format";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import type { Patient } from "@/types/database.types";

type PatientDetailHeaderProps = {
  patient: Patient;
  onEdit: () => void;
  onOpenGallery: () => void;
};

export default function PatientDetailHeader({
  patient,
  onEdit,
  onOpenGallery,
}: PatientDetailHeaderProps) {
  const resolvedAvatarUrl = useFileUrl(patient.avatar_url ?? null);
  const initials = getProfileInitials(patient.full_name);
  const subtitleParts = [
    formatAge(patient.birth_date),
    patient.dni,
    patient.phone,
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle text-primary ring-1 ring-border-subtle">
          {resolvedAvatarUrl ? (
            <Image
              src={resolvedAvatarUrl}
              alt=""
              width={80}
              height={80}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xl font-medium">{initials}</span>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-ink">
            {patient.full_name}
          </h1>
          {subtitleParts.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              {subtitleParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <ActionButton
          title={PATIENT_DETAIL_COPY.actions.edit}
          onClick={onEdit}
        />
        <ActionButton
          title={PATIENT_DETAIL_COPY.actions.openGallery}
          icon={Images}
          variant="ghost"
          onClick={onOpenGallery}
        />
      </div>
    </div>
  );
}
