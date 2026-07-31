import { notFound } from "next/navigation";

import PatientDetailPageClient from "@/components/patients/patient-detail-page-client";
import { getPatient, getPatientAppointments } from "@/dal/patients.server.dal";
import { logger } from "@/lib/logger";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let patient: Awaited<ReturnType<typeof getPatient>>;
  let appointments: Awaited<ReturnType<typeof getPatientAppointments>>;

  try {
    [patient, appointments] = await Promise.all([
      getPatient(id),
      getPatientAppointments(id),
    ]);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadPatientDetail",
      patientId: id,
    });
    return <PatientDetailPageClient />;
  }

  if (!patient) {
    notFound();
  }

  return (
    <PatientDetailPageClient
      patient={patient}
      initialAppointments={appointments}
    />
  );
}
