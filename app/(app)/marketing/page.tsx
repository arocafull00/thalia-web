import MarketingPageClient from "@/components/marketing/marketing-page-client";
import { getCampaignsPage } from "@/dal/campaigns.server.dal";
import {
  CAMPAIGNS_PAGE_SIZE,
  campaignDateRangeToIso,
} from "@/lib/campaign-pagination";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    page?: string;
    q?: string;
    status?: string;
    to?: string;
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
    status: params.status?.trim() ?? "",
    ...campaignDateRangeToIso(params.from ?? "", params.to ?? ""),
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: CAMPAIGNS_PAGE_SIZE,
  };

  const page = await getCampaignsPage({ ...query, clinicId });

  return <MarketingPageClient initialPage={page} initialQuery={query} />;
}
