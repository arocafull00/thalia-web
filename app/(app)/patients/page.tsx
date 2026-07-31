import PatientsPageClient from "@/components/patients/patients-page-client";
import { getPatients } from "@/dal/patients.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);

  const patients = await getPatients(clinicId, q);

  return <PatientsPageClient initialPatients={patients} initialSearch={q} />;
}
