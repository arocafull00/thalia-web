"use client";

import { Mail, Phone } from "lucide-react";
import Image from "next/image";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import type { Patient } from "@/types/database.types";

type PatientProfileHeaderProps = {
  patient: Patient;
};

export default function PatientProfileHeader({
  patient,
}: PatientProfileHeaderProps) {
  const resolvedAvatarUrl = useFileUrl(patient.avatar_url ?? null);
  const initials = getProfileInitials(patient.full_name);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center lg:gap-4 lg:px-6 lg:py-8">
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 lg:size-20">
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
          <span className="text-xl font-semibold">{initials}</span>
        )}
      </div>

      <div className="min-w-0 space-y-3">
        <h1 className="text-xl font-semibold text-ink text-wrap-balance">
          {patient.full_name}
        </h1>

        <div className="flex flex-col items-center gap-2">
          {patient.phone ? (
            <a
              href={`tel:${patient.phone}`}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
            >
              <Phone
                className="size-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <span>{patient.phone}</span>
            </a>
          ) : null}
          {patient.email ? (
            <a
              href={`mailto:${patient.email}`}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
            >
              <Mail
                className="size-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <span>{patient.email}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
