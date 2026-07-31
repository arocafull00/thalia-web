import type { PatientImageWithPatient } from "@/types/database.types";

export type TreatmentImageGalleryItem = {
  image: PatientImageWithPatient;
  src: string;
  alt: string;
  patientName: string;
};
