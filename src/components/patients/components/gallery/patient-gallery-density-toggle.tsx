"use client";

import { Grid3x3, LayoutGrid, Square } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientGalleryDensity } from "@/lib/patient-gallery-density";

const DENSITY_OPTIONS: {
  value: PatientGalleryDensity;
  label: string;
  icon: typeof Grid3x3;
}[] = [
  {
    value: "compact",
    label: PATIENT_GALLERY_COPY.density.compact,
    icon: Grid3x3,
  },
  {
    value: "comfortable",
    label: PATIENT_GALLERY_COPY.density.comfortable,
    icon: LayoutGrid,
  },
  {
    value: "large",
    label: PATIENT_GALLERY_COPY.density.large,
    icon: Square,
  },
];

type PatientGalleryDensityToggleProps = {
  density: PatientGalleryDensity;
  onChange: (density: PatientGalleryDensity) => void;
};

export default function PatientGalleryDensityToggle({
  density,
  onChange,
}: PatientGalleryDensityToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={density}
      aria-label={PATIENT_GALLERY_COPY.density.label}
      onValueChange={(value) => {
        if (!value) {
          return;
        }

        onChange(value as PatientGalleryDensity);
      }}
    >
      {DENSITY_OPTIONS.map((option) => {
        const Icon = option.icon;

        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            data-cuelume-toggle=""
            data-testid={`patient-gallery-density-${option.value}`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
