import type { Metadata } from "next";

import AppointmentConfirmationPageClient from "@/components/appointment-confirmation/appointment-confirmation-page-client";
import { APPOINTMENT_CONFIRMATION_COPY as COPY } from "@/copy/appointment-confirmation-copy";
import { getAppointmentConfirmationServer } from "@/dal/appointment-confirmations.server.dal";

export const metadata: Metadata = {
  title: COPY.page.title,
  description: COPY.page.description,
  // El enlace lleva datos de una cita concreta: no debe acabar en un buscador.
  robots: { index: false, follow: false },
  /*
   * Vista previa del enlace en WhatsApp. Sin `og:image` el cliente rastrea la
   * página y se queda con el favicon, que al escalarlo sale borroso.
   *
   * Además cumple una función: el paciente recibe un enlace no solicitado con
   * un identificador largo, y una tarjeta con el logo y «Confirmación de cita»
   * es lo que lo distingue de algo sospechoso.
   */
  openGraph: {
    type: "website",
    siteName: "Thalia",
    title: COPY.page.title,
    description: COPY.page.description,
    /*
     * Cuadrada y a resolución nativa, sin reescalar. El logo de mayor
     * resolución del proyecto son 512 px: meterlo en un lienzo apaisado de
     * 1200x630 obligaba a remuestrearlo y a dejarlo ocupando un tercio del
     * ancho, y WhatsApp lo mostraba blando. Así el cliente recibe cada píxel
     * original y decide él cómo encajarlo.
     *
     * El techo de nitidez es esa fuente de 512 px: para una tarjeta realmente
     * crujiente en pantallas 3x hace falta un logo vectorial o de 1500 px.
     */
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "Thalia",
      },
    ],
  },
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
