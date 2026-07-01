import AppointmentDetailPageClient from "@/components/appointments/appointment-detail-page-client";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AppointmentDetailPageClient appointmentId={id} />;
}
