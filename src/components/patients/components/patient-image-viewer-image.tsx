"use client";

import Image from "next/image";

import { usePatientImageUrl } from "@/lib/hooks/use-patient-images";
import type { PatientImage } from "@/types/database.types";

type PatientImageViewerImageProps = {
  image: PatientImage;
  label: string;
};

export default function PatientImageViewerImage({
  image,
  label,
}: PatientImageViewerImageProps) {
  const imageUrl = usePatientImageUrl(image);

  if (!imageUrl) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-canvas">
        <div className="size-10 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[50vh] w-full bg-canvas">
      <Image
        src={imageUrl}
        alt={label}
        fill
        unoptimized
        className="object-contain"
        sizes="100vw"
        priority
      />
    </div>
  );
}
