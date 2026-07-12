import { useMemo } from "react";

import PatientClinicalNotesPanel from "@/components/patients/components/patient-clinical-notes-panel";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import {
  usePatientAppointments,
  useUpcomingPatientAppointments,
} from "@/lib/hooks/use-patients";
import { derivePatientDetailStats } from "@/lib/patient-detail-stats";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

import PatientDetailStatsRow from "./patient-detail-stats";

type PatientSummaryTabProps = {
  patient: Patient;
  appointments: AppointmentWithRelations[];
  isLoading: boolean;
  error: Error | null | undefined;
  onEditNotes: () => void;
};

export default function PatientSummaryTab({
  patient,
  onEditNotes,
}: PatientSummaryTabProps) {
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

      <PatientClinicalNotesPanel patient={patient} onEditNotes={onEditNotes} />
    </div>
  );
}
