import { Phone, User } from "lucide-react";
import Link from "next/link";

import AppointmentDetailCard from "@/components/appointments/components/appointment-detail-card";
import AppointmentPersonAvatar from "@/components/appointments/components/appointment-person-avatar";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentPatientCardProps = {
  patient: AppointmentWithRelations["patients"];
};

export default function AppointmentPatientCard({
  patient,
}: AppointmentPatientCardProps) {
  const name = patient?.full_name ?? "Paciente";
  const phone = patient?.phone ?? null;

  return (
    <AppointmentDetailCard icon={User} title={APPOINTMENT_DETAIL_COPY.patient}>
      <div className="flex items-start gap-4">
        <AppointmentPersonAvatar
          name={name}
          avatarUrl={patient?.avatar_url ?? null}
        />
        <div className="min-w-0">
          {patient?.id ? (
            <Link
              href={`/patients/${patient.id}`}
              className="text-lg font-medium text-ink hover:text-primary"
            >
              {name}
            </Link>
          ) : (
            <p className="text-lg font-medium text-ink">{name}</p>
          )}
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-secondary">
            <Phone className="size-3.5 shrink-0" aria-hidden="true" />
            {phone ? (
              <a href={`tel:${phone}`} className="hover:text-ink">
                {phone}
              </a>
            ) : (
              APPOINTMENT_DETAIL_COPY.noPhone
            )}
          </p>
        </div>
      </div>
    </AppointmentDetailCard>
  );
}
