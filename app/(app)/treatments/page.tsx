import TreatmentsPageClient from "@/components/treatments/treatments-page-client";
import { getTreatments } from "@/dal/treatments.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function TreatmentsPage() {
  const clinicId = await getServerActiveClinicId();
  const treatments = await getTreatments(clinicId);

  return <TreatmentsPageClient initialTreatments={treatments} />;
}
