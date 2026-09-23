"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import CampaignFormDialog from "@/components/marketing/components/form/campaign-form-dialog";
import CampaignsEmptyState from "@/components/marketing/components/list/campaigns-empty-state";
import CampaignsFilters from "@/components/marketing/components/list/campaigns-filters";
import CampaignsFiltersSheet from "@/components/marketing/components/list/campaigns-filters-sheet";
import CampaignsGallery from "@/components/marketing/components/list/campaigns-gallery";
import CampaignsGallerySkeleton from "@/components/marketing/components/list/campaigns-gallery-skeleton";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import PageCard from "@/components/ui/page-card";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import type { CampaignPageResult } from "@/dal/campaigns.dal";
import type { CampaignQuota } from "@/lib/campaign-limits";
import { CAMPAIGNS_PAGE_SIZE } from "@/lib/campaign-pagination";
import { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";
import { useCampaignQuota } from "@/lib/hooks/use-campaigns";
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
  initialPage?: CampaignPageResult;
  initialQuery?: CampaignsPageQuery;
  initialQuota?: CampaignQuota;
};

export default function MarketingPageClient({
  initialPage,
  initialQuery,
  initialQuota,
}: MarketingPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    MARKETING_FILTER_DEFAULTS,
  );

  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );
  const quota = useCampaignQuota(initialQuota);
  const treatments = useTreatments();
  const dialog = useCampaignCreateDialog(() => setDialogOpen(false));

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      search: filters.q,
      status: filters.status,
      from: filters.from,
      to: filters.to,
      page: pageIndex,
    }),
    [filters.from, filters.q, filters.status, filters.to, pageIndex],
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

  const showEmptyState =
    !campaigns.isLoading && !campaigns.error && !hasCampaigns;

  const handleCancelCreate = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  const handleCreate = () => {
    if (quota.data?.reached) {
      toast.error(MARKETING_COPY.limits.sentLimitReached);
      return;
    }

    setDialogOpen(true);
  };

  const handleClearFilters = () =>
    setFilters({ q: "", status: "", from: "", to: "", page: "" });

  // La clave remonta la hoja para que abra siempre con los filtros vigentes.
  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  useTopbarAction({
    title: MARKETING_COPY.actions.create,
    testId: "campaign-create-trigger",
    onClick: handleCreate,
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
        {campaigns.isLoading ? <CampaignsGallerySkeleton /> : null}
        {campaigns.error ? (
          <Notice tone="danger" message={MARKETING_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? <CampaignsEmptyState /> : null}
        {!campaigns.isLoading && !campaigns.error && hasCampaigns ? (
          <CampaignsGallery
            campaigns={campaigns.campaigns}
            onClearFilters={handleClearFilters}
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
      <MobileFab label={MARKETING_COPY.actions.create} onClick={handleCreate} />
    </div>
  );
}
