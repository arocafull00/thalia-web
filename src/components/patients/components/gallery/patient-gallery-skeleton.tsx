import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

export default function PatientGallerySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label={PATIENT_GALLERY_COPY.loading}
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="aspect-square animate-pulse rounded-xl bg-border"
        />
      ))}
    </div>
  );
}
