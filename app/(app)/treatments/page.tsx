import TreatmentsPageClient from "@/components/treatments/treatments-page-client";
import {
  getTreatmentCategories,
  getTreatmentsPage,
} from "@/dal/treatments.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { TREATMENTS_PAGE_SIZE } from "@/lib/treatment-pagination";

export default async function TreatmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
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
    category: params.category?.trim() ?? "",
    search: params.q?.trim() ?? "",
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: TREATMENTS_PAGE_SIZE,
  };

  const [page, categories] = await Promise.all([
    getTreatmentsPage({ ...query, clinicId }),
    getTreatmentCategories(clinicId),
  ]);

  return (
    <TreatmentsPageClient
      initialTreatments={page.treatments}
      initialTotal={page.total}
      initialQuery={query}
      initialCategories={categories}
    />
  );
}
