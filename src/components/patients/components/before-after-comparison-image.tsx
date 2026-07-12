"use client";

import Image from "next/image";

import { usePatientImageUrl } from "@/lib/hooks/use-patient-images";
import type { PatientImage } from "@/types/database.types";

type BeforeAfterComparisonImageProps = {
  image: PatientImage;
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function BeforeAfterComparisonImage({
  image,
  label,
  className,
  style,
}: BeforeAfterComparisonImageProps) {
  const imageUrl = usePatientImageUrl(image);

  if (!imageUrl) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-canvas ${className ?? ""}`}
        style={style}
      >
        <div className="size-10 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${className ?? ""}`} style={style}>
      <Image
        src={imageUrl}
        alt={label}
        fill
        unoptimized
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}
