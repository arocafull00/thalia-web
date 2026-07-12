import PatientGalleryImageThumb from "@/components/patients/components/patient-gallery-image-thumb";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientImage } from "@/types/database.types";

type PatientGalleryDateGroupProps = {
  label: string;
  images: PatientImage[];
  selectionMode: boolean;
  selectedImageIds: string[];
  onViewImage: (image: PatientImage) => void;
  onToggleSelect: (image: PatientImage) => void;
  onDeleteSuccess: () => void;
};

export default function PatientGalleryDateGroup({
  label,
  images,
  selectionMode,
  selectedImageIds,
  onViewImage,
  onToggleSelect,
  onDeleteSuccess,
}: PatientGalleryDateGroupProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink">
        {label} · {PATIENT_GALLERY_COPY.photosCount(images.length)}
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {images.map((image) => (
          <PatientGalleryImageThumb
            key={image.id}
            image={image}
            selectionMode={selectionMode}
            isSelected={selectedImageIds.includes(image.id)}
            onView={() => onViewImage(image)}
            onDelete={onDeleteSuccess}
            onToggleSelect={() => onToggleSelect(image)}
          />
        ))}
      </div>
    </div>
  );
}
