import { TabsContent } from "@/components/ui/tabs";
import type {
  AppointmentStatus,
  Patient,
  PatientFile,
  PatientImage,
} from "@/types/database.types";

import PatientFilesTab from "../files/patient-files-tab";
import PatientGalleryTab from "../gallery/patient-gallery-tab";

type PatientDetailTabContentProps = {
  patient: Patient;
  onDeleteFile: (file: PatientFile, onSuccess?: () => void) => void;
  onDeleteImage: (image: PatientImage) => void;
  onOpenUploader: () => void;
  onOpenFilesUploader: () => void;
  readOnly?: boolean;
};

export default function PatientDetailTabContent({
  patient,
  onDeleteFile,
  onDeleteImage,
  onOpenUploader,
  onOpenFilesUploader,
  readOnly = false,
}: PatientDetailTabContentProps) {
  return (
    <>
      <TabsContent value="gallery">
        <PatientGalleryTab
          patient={patient}
          onDeleteImage={onDeleteImage}
          onOpenUploader={onOpenUploader}
          readOnly={readOnly}
        />
      </TabsContent>
      <TabsContent value="files">
        <PatientFilesTab
          patient={patient}
          onDelete={onDeleteFile}
          onOpenUploader={onOpenFilesUploader}
          readOnly={readOnly}
        />
      </TabsContent>
    </>
  );
}
