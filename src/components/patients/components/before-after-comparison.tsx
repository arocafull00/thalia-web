"use client";

import { useState } from "react";

import BeforeAfterComparisonImage from "@/components/patients/components/before-after-comparison-image";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import type { PatientImage } from "@/types/database.types";

type BeforeAfterComparisonProps = {
  beforeImage: PatientImage;
  afterImage: PatientImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  open,
  onOpenChange,
}: BeforeAfterComparisonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState(50);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-w-4xl">
        <AppDialogHeader>
          <AppDialogTitle>
            {PATIENT_GALLERY_COPY.beforeAfter.title}
          </AppDialogTitle>
        </AppDialogHeader>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas">
          <BeforeAfterComparisonImage
            image={afterImage}
            label={PATIENT_GALLERY_COPY.beforeAfter.after}
          />
          <BeforeAfterComparisonImage
            image={beforeImage}
            label={PATIENT_GALLERY_COPY.beforeAfter.before}
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          />

          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-on-primary"
            style={{ left: `${position}%` }}
          />

          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label={PATIENT_GALLERY_COPY.beforeAfter.sliderLabel}
            className={`absolute inset-x-4 bottom-4 z-10 ${
              prefersReducedMotion ? "" : "transition-[left]"
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-ink-secondary">
          <span>{PATIENT_GALLERY_COPY.beforeAfter.before}</span>
          <span>{PATIENT_GALLERY_COPY.beforeAfter.after}</span>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
}
