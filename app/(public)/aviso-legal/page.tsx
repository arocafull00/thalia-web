import type { Metadata } from "next";

import LegalNoticePage from "@/components/legal/legal-notice/legal-notice-page";

export const metadata: Metadata = {
  title: "Aviso legal | Thalia",
  description:
    "Datos identificativos del titular de Thalia, condiciones de uso de los sitios web y contacto.",
};

export default function Page() {
  return <LegalNoticePage />;
}
