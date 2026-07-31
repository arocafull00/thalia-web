import { notFound } from "next/navigation";

import AppointmentDetailPageClient from "@/components/appointments/appointment-detail-page-client";
import { getAppointment } from "@/dal/appointments.server.dal";
import { logger } from "@/lib/logger";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let appointment: Awaited<ReturnType<typeof getAppointment>>;

  try {
    appointment = await getAppointment(id);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadAppointmentDetail",
      appointmentId: id,
    });
    return <AppointmentDetailPageClient />;
  }

  if (!appointment) {
    notFound();
  }

  return <AppointmentDetailPageClient appointment={appointment} />;
}
