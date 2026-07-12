"use client";

import { Calendar, Clock, Phone } from "lucide-react";

import AppointmentHeaderPerson from "@/components/appointments/components/appointment-header-person";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { Separator } from "@/components/ui/separator";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  formatAppointmentDetailDay,
  formatAppointmentDuration,
  formatAppointmentTimeRange,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentHeaderProps = {
  appointment: AppointmentWithRelations;
};

export default function AppointmentHeader({
  appointment,
}: AppointmentHeaderProps) {
  const patient = appointment.patients;
  const employee = appointment.employees;
  const patientName = patient?.full_name ?? APPOINTMENT_DETAIL_COPY.patient;
  const employeeName = employee?.full_name ?? "-";
  const patientPhone = patient?.phone ?? null;

  return (
    <div className="shrink-0 space-y-4 px-4 pt-6 pb-6 lg:px-8">
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
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" aria-hidden="true" />
          {formatAppointmentDetailDay(appointment.starts_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {formatAppointmentTimeRange(
            appointment.starts_at,
            appointment.ends_at,
          )}
        </span>
        <span>{formatAppointmentDuration(appointment)}</span>
      </div>
    </div>
  );
}
