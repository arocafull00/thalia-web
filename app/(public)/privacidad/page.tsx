import type { Metadata } from "next";

import PrivacyCorporatePage from "@/components/legal/privacy/privacy-corporate-page";

export const metadata: Metadata = {
  title: "Política de privacidad | Thalia",
  description:
    "Consulta cómo Thalia trata los datos personales recogidos a través de la web corporativa.",
};

export default function Page() {
  return <PrivacyCorporatePage />;
}
