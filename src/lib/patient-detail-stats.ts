import { formatDate, getTreatmentName } from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

export type PatientDetailStats = {
  lastAppointmentLabel: string;
  currentTreatmentLabel: string;
  nextAppointmentLabel: string;
  totalAppointmentsLabel: string;
};

function getMostRecentPastAppointment(
  appointments: AppointmentWithRelations[],
) {
  const now = Date.now();
  const pastAppointments = appointments.filter(
    (appointment) => new Date(appointment.starts_at).getTime() <= now,
  );

  if (pastAppointments.length === 0) {
    return null;
  }

  return pastAppointments.reduce((latest, appointment) =>
    new Date(appointment.starts_at) > new Date(latest.starts_at)
      ? appointment
      : latest,
  );
}

export type PatientTreatmentUsage = {
  treatmentId: string;
  name: string;
  count: number;
};

export function derivePatientTreatmentUsage(
  appointments: AppointmentWithRelations[],
): PatientTreatmentUsage[] {
  const usageById = new Map<string, PatientTreatmentUsage>();

  for (const appointment of appointments) {
    for (const appointmentTreatment of appointment.appointment_treatments) {
      const treatment = appointmentTreatment.treatment;

      if (!treatment) {
        continue;
      }

      const existing = usageById.get(treatment.id);

      if (existing) {
        existing.count += 1;
        continue;
      }

      usageById.set(treatment.id, {
        treatmentId: treatment.id,
        name: treatment.name,
        count: 1,
      });
    }
  }

  return [...usageById.values()].toSorted(
    (left, right) => right.count - left.count,
  );
}

export function derivePatientDetailStats(
  appointments: AppointmentWithRelations[],
  upcomingAppointments: AppointmentWithRelations[],
  emptyLabel: string,
): PatientDetailStats {
  const lastAppointment = getMostRecentPastAppointment(appointments);
  const nextAppointment = upcomingAppointments[0];

  return {
    lastAppointmentLabel: lastAppointment
      ? formatDate(lastAppointment.starts_at)
      : emptyLabel,
    currentTreatmentLabel: lastAppointment
      ? getTreatmentName(lastAppointment)
      : emptyLabel,
    nextAppointmentLabel: nextAppointment
      ? formatDate(nextAppointment.starts_at)
      : emptyLabel,
    totalAppointmentsLabel: String(appointments.length),
  };
}
