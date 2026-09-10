"use client";

import { Phone } from "lucide-react";

import AppointmentHeaderDatetime from "@/components/appointments/components/appointment-header-datetime";
import AppointmentHeaderPerson from "@/components/appointments/components/appointment-header-person";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { Separator } from "@/components/ui/separator";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentHeaderProps = {
  appointment: AppointmentWithRelations;
};

export default function AppointmentHeader({
  appointment,
}: AppointmentHeaderProps) {
  const timezone = useActiveClinicTimezone();
  const patient = appointment.patients;
  const employee = appointment.employees;
  const patientName = patient?.full_name ?? APPOINTMENT_DETAIL_COPY.patient;
  const employeeName = employee?.full_name ?? "-";
  const patientPhone = patient?.phone ?? null;

  return (
    <div className="shrink-0 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <AppointmentHeaderPerson
          label={APPOINTMENT_DETAIL_COPY.patient}
          name={patientName}
          href={patient?.id ? `/patients/${patient.id}` : null}
          avatarUrl={patient?.avatar_url ?? null}
          trailing={<AppointmentStatusBadge status={appointment.status} />}
          secondary={
            <p className="flex items-center gap-1.5 text-sm text-ink-secondary">
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              {patientPhone ? (
                <a href={`tel:${patientPhone}`} className="hover:text-ink">
                  {patientPhone}
                </a>
              ) : (
                APPOINTMENT_DETAIL_COPY.noPhone
              )}
            </p>
          }
        />

        <Separator className="sm:hidden" />
        <Separator
          orientation="vertical"
          className="mx-4 hidden self-stretch sm:block"
        />

        <AppointmentHeaderPerson
          label={APPOINTMENT_DETAIL_COPY.employee}
          name={employeeName}
          href={employee?.id ? `/employees/${employee.id}` : null}
          avatarUrl={employee?.avatar_url ?? null}
          fallbackClassName={
            employee?.color
              ? "text-on-primary"
              : "bg-primary-subtle text-primary"
          }
          fallbackStyle={
            employee?.color ? { backgroundColor: employee.color } : undefined
          }
          secondary={
            employee?.specialty ? (
              <p className="text-sm text-ink-secondary">{employee.specialty}</p>
            ) : null
          }
        />

        <Separator className="sm:hidden" />
        <Separator
          orientation="vertical"
          className="mx-4 hidden self-stretch sm:block"
        />

        <AppointmentHeaderDatetime
          appointment={appointment}
          timezone={timezone}
        />
      </div>
    </div>
  );
}
