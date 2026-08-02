import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { PATIENT_GALLERY_DENSITY_GRID_CLASSES } from "@/lib/patient-gallery-density";
import type { PatientGalleryDensity } from "@/lib/patient-gallery-density";
import type { PatientImage } from "@/types/database.types";

import PatientGalleryImageThumb from "./patient-gallery-image-thumb";

type PatientGalleryDateGroupProps = {
  label: string;
  images: PatientImage[];
  density: PatientGalleryDensity;
  selectionMode: boolean;
  selectedImageIds: string[];
  eagerImageIds: Set<string>;
  onViewImage: (image: PatientImage) => void;
  onToggleSelect: (image: PatientImage) => void;
};

export default function PatientGalleryDateGroup({
  label,
  images,
  density,
  selectionMode,
  selectedImageIds,
  eagerImageIds,
  onViewImage,
  onToggleSelect,
}: PatientGalleryDateGroupProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink">
        {label} · {PATIENT_GALLERY_COPY.photosCount(images.length)}
      </p>
      <div className={PATIENT_GALLERY_DENSITY_GRID_CLASSES[density]}>
        {images.map((image) => (
          <PatientGalleryImageThumb
            key={image.id}
            image={image}
            selectionMode={selectionMode}
            isSelected={selectedImageIds.includes(image.id)}
            loading={eagerImageIds.has(image.id) ? "eager" : "lazy"}
            onView={() => onViewImage(image)}
            onToggleSelect={() => onToggleSelect(image)}
          />
        ))}
      </div>
    </div>
  );
}
