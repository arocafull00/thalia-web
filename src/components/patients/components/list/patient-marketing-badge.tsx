import { Badge } from "@/components/ui/badge";
import { PATIENTS_COPY } from "@/copy/patients-copy";

type PatientMarketingBadgeProps = {
  optedIn: boolean;
};

/**
 * Consentimiento del paciente para recibir comunicaciones comerciales. Sin él
 * no entra en ninguna campaña, así que interesa verlo de un vistazo en el
 * listado y no sólo al abrir la ficha.
 */
export default function PatientMarketingBadge({
  optedIn,
}: PatientMarketingBadgeProps) {
  return (
    <Badge variant={optedIn ? "success" : "muted"}>
      {optedIn
        ? PATIENTS_COPY.marketingOptIn.granted
        : PATIENTS_COPY.marketingOptIn.denied}
    </Badge>
  );
}
