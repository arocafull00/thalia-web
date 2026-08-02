"use client";

import { Pencil } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";

type PatientAvatarFieldProps = {
  displayUri: string | null;
  initials: string;
  uploadPending: boolean;
  onFileSelected: (file: File) => void;
};

export default function PatientAvatarField({
  displayUri,
  initials,
  uploadPending,
  onFileSelected,
}: PatientAvatarFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex shrink-0 justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          onFileSelected(file);
        }}
      />
      <Button
        type="button"
        variant="ghost"
        disabled={uploadPending}
        aria-label={PATIENT_CREATE_COPY.fields.avatarLabel}
        onClick={() => fileInputRef.current?.click()}
        className="relative overflow-visible rounded-full p-0"
      >
        <div className="rounded-full bg-surface p-0.5 ring-1 ring-border-subtle">
          <ProfileAvatarImage
            src={displayUri}
            initials={initials}
            size="lg"
            fallbackClassName="bg-primary-subtle text-primary"
          />
        </div>
        <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary text-on-primary">
          <Pencil className="size-3.5" aria-hidden="true" />
        </span>
      </Button>
    </div>
  );
}
