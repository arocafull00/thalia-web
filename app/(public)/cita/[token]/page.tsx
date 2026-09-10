import type { Metadata } from "next";

import AppointmentConfirmationPageClient from "@/components/appointment-confirmation/appointment-confirmation-page-client";
import { APPOINTMENT_CONFIRMATION_COPY as COPY } from "@/copy/appointment-confirmation-copy";
import { getAppointmentConfirmationServer } from "@/dal/appointment-confirmations.server.dal";

export const metadata: Metadata = {
  title: COPY.page.title,
  description: COPY.page.description,
  // El enlace lleva datos de una cita concreta: no debe acabar en un buscador.
  robots: { index: false, follow: false },
};

// El estado depende del momento en que se abre (una cita pasa a 'past' sola),
// así que no se puede cachear.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function AppointmentConfirmationPage({ params }: Props) {
  const { token } = await params;

  // Sólo lectura: abrir la página nunca confirma. WhatsApp y Twilio precargan
  // los enlaces para la vista previa del mensaje, y una confirmación en el GET
  // dispararía sola en cuanto se entregase.
  const initialView = await getAppointmentConfirmationServer(token).catch(
    () => null,
  );

  return (
    <AppointmentConfirmationPageClient
      token={token}
      initialView={initialView}
    />
  );
}
