"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { formatInputDate } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import type { PatientImage } from "@/types/database.types";

import BeforeAfterComparisonImage from "./before-after-comparison-image";

export type BeforeAfterOrientation = "horizontal" | "vertical";

type BeforeAfterComparisonSliderProps = {
  beforeImage: PatientImage;
  afterImage: PatientImage;
  swapped: boolean;
  orientation: BeforeAfterOrientation;
};

function buildComparisonLabel(image: PatientImage, fallback: string) {
  const capturedAt = image.captured_at ?? image.created_at;
  const phaseLabel = image.phase
    ? PATIENT_GALLERY_COPY.phases[image.phase]
    : fallback;

  if (!capturedAt) {
    return phaseLabel;
  }

  return `${formatInputDate(capturedAt)} · ${phaseLabel}`;
}

export default function BeforeAfterComparisonSlider({
  beforeImage,
  afterImage,
  swapped,
  orientation,
}: BeforeAfterComparisonSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemOneImage = swapped ? afterImage : beforeImage;
  const itemTwoImage = swapped ? beforeImage : afterImage;
  const itemOneLabel = buildComparisonLabel(
    itemOneImage,
    swapped
      ? PATIENT_GALLERY_COPY.beforeAfter.after
      : PATIENT_GALLERY_COPY.beforeAfter.before,
  );
  const itemTwoLabel = buildComparisonLabel(
    itemTwoImage,
    swapped
      ? PATIENT_GALLERY_COPY.beforeAfter.before
      : PATIENT_GALLERY_COPY.beforeAfter.after,
  );

  return (
    <ReactCompareSlider
      itemOne={
        <BeforeAfterComparisonImage image={itemOneImage} label={itemOneLabel} />
      }
      itemTwo={
        <BeforeAfterComparisonImage image={itemTwoImage} label={itemTwoLabel} />
      }
      portrait={orientation === "vertical"}
      onlyHandleDraggable
      transition={
        prefersReducedMotion ? "0s" : "0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      }
      handle={
        <ReactCompareSliderHandle
          buttonStyle={{
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            background: "var(--primary)",
            border: "2px solid var(--on-primary)",
            boxShadow: "var(--shadow-float)",
            width: 40,
            height: 40,
          }}
          linesStyle={{
            background: "var(--on-primary)",
            width: 2,
          }}
        />
      }
      className="h-full w-full"
    />
  );
}
