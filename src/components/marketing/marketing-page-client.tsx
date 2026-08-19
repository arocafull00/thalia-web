"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import CampaignFormDialog from "@/components/marketing/components/form/campaign-form-dialog";
import CampaignImageDialog from "@/components/marketing/components/list/campaign-image-dialog";
import CampaignsEmptyState from "@/components/marketing/components/list/campaigns-empty-state";
import CampaignsFilters from "@/components/marketing/components/list/campaigns-filters";
import CampaignsFiltersSheet from "@/components/marketing/components/list/campaigns-filters-sheet";
import CampaignsTable from "@/components/marketing/components/list/campaigns-table";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import PageCard from "@/components/ui/page-card";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import type { CampaignPageResult } from "@/dal/campaigns.dal";
import { CAMPAIGNS_PAGE_SIZE } from "@/lib/campaign-pagination";
import { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useMarketingPage } from "@/lib/hooks/use-marketing-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTreatments } from "@/lib/hooks/use-treatment";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { CampaignsPageQuery } from "@/stores/campaigns-store";

const MARKETING_FILTER_DEFAULTS = {
  q: "",
  status: "",
  from: "",
  to: "",
  page: "",
};

type MarketingPageClientProps = {
  initialPage: CampaignPageResult;
  initialQuery: CampaignsPageQuery;
};

export default function MarketingPageClient({
  initialPage,
  initialQuery,
}: MarketingPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    MARKETING_FILTER_DEFAULTS,
  );

  // Cualquier cambio de filtro, búsqueda incluida, vuelve a la página 1:
  // quedarse en la 5 tras filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );
  const treatments = useTreatments();
  const dialog = useCampaignCreateDialog(() => setDialogOpen(false));

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      search: searchQuery,
      status: filters.status,
      from: filters.from,
      to: filters.to,
      page: pageIndex,
    }),
    [filters.from, filters.status, filters.to, pageIndex, searchQuery],
  );

  const { campaigns, hasCampaigns } = useMarketingPage(pageFilters, {
    initialPage,
    initialQuery,
  });

  const treatmentOptions = useMemo(
    () =>
      (treatments.data ?? []).map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
      })),
    [treatments.data],
  );

  const showEmptyState = !campaigns.isLoading && !hasCampaigns;

  const handleCancelCreate = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  // Estable para que las columnas no se reconstruyan en cada render.
  const handleOpenImage = useCallback((key: string) => setImageKey(key), []);

  // La clave remonta la hoja para que abra siempre con los filtros vigentes.
  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  useTopbarAction({
    title: MARKETING_COPY.actions.create,
    testId: "campaign-create-trigger",
    onClick: () => setDialogOpen(true),
  });

  return (
    <div data-testid="marketing-page" className="flex min-h-0 flex-1 flex-col">
      <PageCard
        filters={
          hasCampaigns ? (
            <CampaignsFilters
              search={filters.q}
              status={filters.status}
              from={filters.from}
              to={filters.to}
              onSearchChange={handleSearchChange}
              onStatusChange={(value) => setFilterAndResetPage("status", value)}
              onFromChange={(value) => setFilterAndResetPage("from", value)}
              onToChange={(value) => setFilterAndResetPage("to", value)}
              onClearDates={() => setFilters({ from: "", to: "", page: "" })}
              onOpenSheet={handleOpenFiltersSheet}
            />
          ) : null
        }
      >
        {campaigns.isLoading ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
        {campaigns.error ? (
          <Notice tone="danger" message={MARKETING_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? <CampaignsEmptyState /> : null}
        {!campaigns.isLoading && hasCampaigns ? (
          <CampaignsTable
            campaigns={campaigns.campaigns}
            onRowClick={(campaignId) => router.push(`/marketing/${campaignId}`)}
            onOpenImage={handleOpenImage}
            pagination={{
              pageIndex,
              pageSize: CAMPAIGNS_PAGE_SIZE,
              total: campaigns.total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
          />
        ) : null}
      </PageCard>
      <CampaignFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialog={dialog}
        treatments={treatmentOptions}
        onCancel={handleCancelCreate}
      />
      <CampaignsFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={{
          status: filters.status,
          from: filters.from,
          to: filters.to,
        }}
        onApply={(updates) => setFilters({ ...updates, page: "" })}
        onClear={() => setFilters({ status: "", from: "", to: "", page: "" })}
        onDismiss={() => setSheetOpen(false)}
      />
      <CampaignImageDialog
        storageKey={imageKey}
        open={imageKey !== null}
        onOpenChange={(next) => {
          if (!next) {
            setImageKey(null);
          }
        }}
      />
      <MobileFab
        label={MARKETING_COPY.actions.create}
        onClick={() => setDialogOpen(true)}
      />
    </div>
  );
}
