import PatientsPageClient from "@/components/patients/patients-page-client";
import { getPatientsPage } from "@/dal/patients.server.dal";
import {
  parseMarketingFilter,
  PATIENTS_PAGE_SIZE,
} from "@/lib/patient-pagination";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    marketing?: string;
    page?: string;
    q?: string;
  }>;
}) {
  const [params, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);

  // Se siembra la consulta tal y como viene en la URL. Si no coincide con la
  // que calcula el cliente, `useServerSeed` la descarta y refetchea; sembrar
  // una página distinta de la que se va a mostrar sería peor que no sembrar.
  const query = {
    search: params.q?.trim() ?? "",
    marketingOptIn: parseMarketingFilter(params.marketing ?? ""),
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: PATIENTS_PAGE_SIZE,
  };

  const page = await getPatientsPage({ ...query, clinicId });

  return (
    <PatientsPageClient
      initialPatients={page.patients}
      initialTotal={page.total}
      initialQuery={query}
    />
  );
}
