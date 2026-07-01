import PatientDetailPageClient from "@/components/patients/patient-detail-page-client";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetailPageClient patientId={id} />;
}
