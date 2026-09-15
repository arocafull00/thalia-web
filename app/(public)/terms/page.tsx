import type { Metadata } from "next";

import TermsPage from "@/components/legal/terms/terms-page";

export const metadata: Metadata = {
  title: "Términos y condiciones | Thalia",
  description:
    "Consulta los términos y condiciones de contratación, acceso y uso de Thalia.",
};

export default function Page() {
  return <TermsPage />;
}
