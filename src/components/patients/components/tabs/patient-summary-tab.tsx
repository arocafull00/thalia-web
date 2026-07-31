"use client";

import { useMemo, useState } from "react";

import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { derivePatientDetailStats } from "@/lib/patient-detail-stats";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

import PatientDetailStatsRow from "../detail/patient-detail-stats";

import PatientClinicalNotesPanel from "./patient-clinical-notes-panel";

type PatientSummaryTabProps = {
  patient: Patient;
  appointments: AppointmentWithRelations[];
};

export default function PatientSummaryTab({
  patient,
  appointments,
}: PatientSummaryTabProps) {
  const [referenceTime] = useState(Date.now);
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
      ),
    [appointments, upcomingAppointments],
  );
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <PatientDetailStatsRow stats={stats} />

      <PatientClinicalNotesPanel patient={patient} />
    </div>
  );
}
