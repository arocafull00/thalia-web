"use client";

import { CalendarPlus, Mail, Pencil, Phone } from "lucide-react";
import { useMemo, useState } from "react";

import PatientAvatarField from "@/components/patients/components/shared/patient-avatar-field";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { formatAge, formatDate } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { derivePatientDetailStats } from "@/lib/patient-detail-stats";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

type PatientDetailSidebarProps = {
  patient: Patient;
  appointments: AppointmentWithRelations[];
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
  onEdit: () => void;
  onCreateAppointment: () => void;
  readOnly?: boolean;
};

export default function PatientDetailSidebar({
  patient,
  appointments,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
  onEdit,
  onCreateAppointment,
  readOnly = false,
}: PatientDetailSidebarProps) {
  const timezone = useActiveClinicTimezone();
  const [referenceTime] = useState(Date.now);
  const initials = getProfileInitials(patient.full_name);

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            new Date(appointment.starts_at).getTime() > referenceTime,
        )
        .toSorted(
          (left, right) =>
            new Date(left.starts_at).getTime() -
            new Date(right.starts_at).getTime(),
        ),
    [appointments, referenceTime],
  );

  const stats = useMemo(
    () =>
      derivePatientDetailStats(
        appointments,
        upcomingAppointments,
        PATIENT_DETAIL_COPY.stats.empty,
        timezone,
      ),
    [appointments, timezone, upcomingAppointments],
  );

  const dataRows = [
    { label: PATIENT_DETAIL_COPY.fields.dni, value: patient.dni },
    {
      label: PATIENT_DETAIL_COPY.fields.birthDate,
      value: patient.birth_date
        ? formatDate(patient.birth_date, timezone)
        : null,
    },
    { label: PATIENT_DETAIL_COPY.fields.phone, value: patient.phone },
    { label: PATIENT_DETAIL_COPY.fields.email, value: patient.email },
    { label: PATIENT_DETAIL_COPY.fields.address, value: patient.address },
  ].filter((row) => row.value);

  const statRows = [
    {
      label: PATIENT_DETAIL_COPY.stats.lastAppointment,
      value: stats.lastAppointmentLabel,
    },
    {
      label: PATIENT_DETAIL_COPY.stats.currentTreatment,
      value: stats.currentTreatmentLabel,
    },
    {
      label: PATIENT_DETAIL_COPY.stats.nextAppointment,
      value: stats.nextAppointmentLabel,
    },
    {
      label: PATIENT_DETAIL_COPY.stats.totalAppointments,
      value: stats.totalAppointmentsLabel,
    },
  ];

  const subtitleParts = [
    formatAge(patient.birth_date),
    patient.dni,
    patient.phone,
  ].filter(Boolean);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border-subtle">
      <div className="px-6 py-8 text-center">
        <div className="mx-auto flex justify-center">
          <PatientAvatarField
            displayUri={avatarDisplayUri}
            initials={initials}
            uploadPending={avatarUploadPending}
            onFileSelected={onAvatarFileSelected}
            readOnly={readOnly}
          />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-ink">{patient.full_name}</h1>
        {subtitleParts.length > 0 ? (
          <p className="mt-1 text-sm text-ink-secondary">
            {subtitleParts.join(" · ")}
          </p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {dataRows.length > 0 ? (
          <dl className="divide-y divide-border-subtle">
            {dataRows.map((row) => (
              <div key={row.label} className="py-3">
                <dt className="text-xs text-ink-muted">{row.label}</dt>
                <dd className="mt-1 text-sm text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <dl className="mt-6 divide-y divide-border-subtle border-t border-border-subtle">
          {statRows.map((row) => (
            <div key={row.label} className="py-3">
              <dt className="text-xs text-ink-muted">{row.label}</dt>
              <dd className="mt-1 text-sm font-medium text-ink tabular-nums">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {patient.notes?.trim() ? (
          <div className="mt-6 border-t border-border-subtle pt-6">
            <p className="text-xs text-ink-muted">
              {PATIENT_DETAIL_COPY.clinicalNotes.title}
            </p>
            <p className="mt-2 text-sm whitespace-pre-wrap text-ink-secondary">
              {patient.notes}
            </p>
          </div>
        ) : null}
      </div>

      {!readOnly ? (
        <div className="mt-auto shrink-0 border-t border-border-subtle px-6 py-6">
          <div className="flex flex-col gap-2 [&>button]:w-full">
            <ActionButton
              title={PATIENT_DETAIL_COPY.actions.createAppointment}
              icon={CalendarPlus}
              onClick={onCreateAppointment}
            />
            <ActionButton
              title={PATIENT_DETAIL_COPY.actions.edit}
              icon={Pencil}
              variant="ghost"
              onClick={onEdit}
              testId="patient-edit-trigger"
            />
            {patient.phone ? (
              <ActionButton
                title={PATIENT_DETAIL_COPY.actions.call}
                icon={Phone}
                variant="ghost"
                onClick={() => {
                  window.location.href = `tel:${patient.phone}`;
                }}
              />
            ) : null}
            {patient.email ? (
              <ActionButton
                title={PATIENT_DETAIL_COPY.actions.email}
                icon={Mail}
                variant="ghost"
                onClick={() => {
                  window.location.href = `mailto:${patient.email}`;
                }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
