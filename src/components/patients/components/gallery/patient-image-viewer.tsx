"use client";

import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import type { PatientImageViewerSlide } from "@/lib/hooks/use-patient-images";

import "yet-another-react-lightbox/styles.css";

type PatientImageViewerProps = {
  slides: PatientImageViewerSlide[];
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActiveIndexChange: (index: number) => void;
};

function toLightboxIndex(
  slides: PatientImageViewerSlide[],
  activeIndex: number,
) {
  const index =
    slides.slice(0, activeIndex + 1).filter((slide) => slide.src.length > 0)
      .length - 1;

  return Math.max(0, index);
}

function toSourceIndex(
  slides: PatientImageViewerSlide[],
  lightboxIndex: number,
) {
  let resolvedCount = 0;

  for (let index = 0; index < slides.length; index++) {
    if (!slides[index]?.src) {
      continue;
    }

    if (resolvedCount === lightboxIndex) {
      return index;
    }

    resolvedCount++;
  }

  return 0;
}

export default function PatientImageViewer({
  slides,
  activeIndex,
  open,
  onOpenChange,
  onActiveIndexChange,
}: PatientImageViewerProps) {
  const readySlides = slides.filter((slide) => slide.src.length > 0);
  const hasMultipleSlides = readySlides.length > 1;

  if (readySlides.length === 0) {
    return null;
  }

  return (
    <Lightbox
      open={open}
      close={() => onOpenChange(false)}
      index={toLightboxIndex(slides, activeIndex)}
      slides={readySlides}
      plugins={[Zoom, Fullscreen]}
      carousel={{
        finite: true,
        preload: 2,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      styles={{
        container: {
          backgroundColor: "rgba(8, 8, 10, 0.95)",
        },
      }}
      render={{
        buttonPrev: hasMultipleSlides ? undefined : () => null,
        buttonNext: hasMultipleSlides ? undefined : () => null,
      }}
      on={{
        view: ({ index }) => {
          onActiveIndexChange(toSourceIndex(slides, index));
        },
      }}
    />
  );
}
