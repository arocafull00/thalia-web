"use client";

import { useState } from "react";

import type { PatientImage } from "@/types/database.types";

import BeforeAfterComparisonSlider, {
  type BeforeAfterOrientation,
} from "./before-after-comparison-slider";
import BeforeAfterComparisonToolbar from "./before-after-comparison-toolbar";

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
