import { FileImage, FileText } from "lucide-react";

import { isPatientFileImage } from "@/lib/patient-file-storage";

type PatientFileIconProps = {
  mimeType: string;
};

export default function PatientFileIcon({ mimeType }: PatientFileIconProps) {
  if (isPatientFileImage(mimeType)) {
    return (
      <FileImage
        className="size-5 shrink-0 text-ink-muted"
        aria-hidden="true"
      />
    );
  }

  return (
    <FileText className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
  );
}
