import { Stethoscope } from "lucide-react";
import Link from "next/link";

import AppointmentDetailCard from "@/components/appointments/components/appointment-detail-card";
import AppointmentPersonAvatar from "@/components/appointments/components/appointment-person-avatar";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentProfessionalCardProps = {
  employee: AppointmentWithRelations["employees"];
};

export default function AppointmentProfessionalCard({
  employee,
}: AppointmentProfessionalCardProps) {
  const name = employee?.full_name ?? "-";

  return (
    <AppointmentDetailCard
      icon={Stethoscope}
      title={APPOINTMENT_DETAIL_COPY.employee}
    >
      <div className="flex items-start gap-4">
        <AppointmentPersonAvatar
          name={name}
          avatarUrl={employee?.avatar_url ?? null}
          fallbackClassName={
            employee?.color
              ? "text-on-primary"
              : "bg-primary-subtle text-primary"
          }
          fallbackStyle={
            employee?.color ? { backgroundColor: employee.color } : undefined
          }
        />
        <div className="min-w-0">
          {employee?.id ? (
            <Link
              href={`/employees/${employee.id}`}
              className="text-lg font-medium text-ink hover:text-primary"
            >
              {name}
            </Link>
          ) : (
            <p className="text-lg font-medium text-ink">{name}</p>
          )}
          {employee?.specialty ? (
            <p className="mt-1 text-sm text-ink-secondary">
              {employee.specialty}
            </p>
          ) : null}
        </div>
      </div>
    </AppointmentDetailCard>
  );
}
