import { Badge } from "@/components/ui/badge";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";

export default function PatientDetailBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
      <Badge variant="success">{PATIENT_DETAIL_COPY.badges.active}</Badge>
      <Badge variant="default">{PATIENT_DETAIL_COPY.badges.noAllergies}</Badge>
      <Badge variant="muted">{PATIENT_DETAIL_COPY.badges.vip}</Badge>
    </div>
  );
}
