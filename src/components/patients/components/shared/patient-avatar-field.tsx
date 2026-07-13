"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
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
    <div className="flex justify-center">
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
        className="relative size-20 shrink-0 overflow-visible rounded-full p-0"
      >
        <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 ring-offset-canvas">
          {displayUri ? (
            <Image
              src={displayUri}
              alt=""
              width={80}
              height={80}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold">{initials}</span>
          )}
        </span>
        <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary text-on-primary">
          <Pencil className="size-3.5" aria-hidden="true" />
        </span>
      </Button>
    </div>
  );
}
