"use client";

import { useState } from "react";

import BeforeAfterComparisonSlider, {
  type BeforeAfterOrientation,
} from "@/components/patients/components/before-after-comparison-slider";
import BeforeAfterComparisonToolbar from "@/components/patients/components/before-after-comparison-toolbar";
import type { PatientImage } from "@/types/database.types";

type BeforeAfterComparisonContentProps = {
  beforeImage: PatientImage;
  afterImage: PatientImage;
  onClose: () => void;
};

export default function BeforeAfterComparisonContent({
  beforeImage,
  afterImage,
  onClose,
}: BeforeAfterComparisonContentProps) {
  const [swapped, setSwapped] = useState(false);
  const [orientation, setOrientation] =
    useState<BeforeAfterOrientation>("horizontal");

  return (
    <>
      <BeforeAfterComparisonToolbar
        orientation={orientation}
        onOrientationChange={setOrientation}
        onSwap={() => setSwapped((current) => !current)}
        onClose={onClose}
      />

      <div className="relative min-h-0 flex-1 bg-canvas">
        <BeforeAfterComparisonSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          swapped={swapped}
          orientation={orientation}
        />
      </div>
    </>
  );
}
