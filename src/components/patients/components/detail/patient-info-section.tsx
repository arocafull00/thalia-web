import {
  Calendar,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { ProfileInfoRow } from "@/components/ui/profile/profile-info-row";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { formatBirthDateWithAge } from "@/lib/format";
import type { Patient } from "@/types/database.types";

type PatientInfoSectionProps = {
  patient: Patient;
};

export default function PatientInfoSection({
  patient,
}: PatientInfoSectionProps) {
  return (
    <div
      aria-label={PATIENT_DETAIL_COPY.sections.general}
      className="divide-y divide-border-subtle px-6 py-6"
    >
      <ProfileInfoRow
        icon={CreditCard}
        iconLabel={PATIENT_DETAIL_COPY.fields.dni}
        value={patient.dni}
      />
      <ProfileInfoRow
        icon={Calendar}
        iconLabel={PATIENT_DETAIL_COPY.fields.birthDate}
        value={formatBirthDateWithAge(patient.birth_date)}
      />
      <ProfileInfoRow
        icon={Phone}
        iconLabel={PATIENT_DETAIL_COPY.fields.phone}
        value={patient.phone}
      />
      <ProfileInfoRow
        icon={Mail}
        iconLabel={PATIENT_DETAIL_COPY.fields.email}
        value={patient.email}
      />
      <ProfileInfoRow
        icon={MapPin}
        iconLabel={PATIENT_DETAIL_COPY.fields.address}
        value={patient.address}
      />
      {patient.notes ? (
        <ProfileInfoRow
          icon={FileText}
          iconLabel={PATIENT_DETAIL_COPY.fields.notes}
          value={patient.notes}
        />
      ) : null}
    </div>
  );
}
