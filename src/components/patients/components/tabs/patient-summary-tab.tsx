import { useMemo } from "react";

import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import {
  usePatientAppointments,
  useUpcomingPatientAppointments,
} from "@/lib/hooks/use-patients";
import { derivePatientDetailStats } from "@/lib/patient-detail-stats";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

import PatientDetailStatsRow from "../detail/patient-detail-stats";

import PatientClinicalNotesPanel from "./patient-clinical-notes-panel";

type PatientSummaryTabProps = {
  patient: Patient;
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
};

export default function PatientSummaryTab({ patient }: PatientSummaryTabProps) {
  const appointmentsQuery = usePatientAppointments(patient.id);
  const upcomingQuery = useUpcomingPatientAppointments(patient.id);

  const appointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  );
  const upcomingAppointments = useMemo(
    () => upcomingQuery.data ?? [],
    [upcomingQuery.data],
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
