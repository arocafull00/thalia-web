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
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useMarketingPage } from "@/lib/hooks/use-marketing-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTreatments } from "@/lib/hooks/use-treatment";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const MARKETING_FILTER_DEFAULTS = { q: "", status: "", from: "", to: "" };

export default function MarketingPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    MARKETING_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const treatments = useTreatments();
  const dialog = useCampaignCreateDialog(() => setDialogOpen(false));

  const pageFilters = useMemo(
    () => ({
      search: searchQuery,
      status: filters.status,
      from: filters.from,
      to: filters.to,
    }),
    [filters.from, filters.status, filters.to, searchQuery],
  );

  const { campaigns, filteredCampaigns, hasCampaigns } =
    useMarketingPage(pageFilters);

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
      <div className="min-h-0 flex-1 overflow-y-auto">
        {hasCampaigns ? (
          <PageStickyFiltersSection>
            <CampaignsFilters
              search={filters.q}
              status={filters.status}
              from={filters.from}
              to={filters.to}
              onSearchChange={handleSearchChange}
              onStatusChange={(value) => setFilter("status", value)}
              onFromChange={(value) => setFilter("from", value)}
              onToChange={(value) => setFilter("to", value)}
              onClearDates={() => setFilters({ from: "", to: "" })}
              onOpenSheet={handleOpenFiltersSheet}
            />
          </PageStickyFiltersSection>
        ) : null}
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          {campaigns.isLoading ? <SkeletonList /> : null}
          {campaigns.error ? (
            <Notice tone="danger" message={MARKETING_COPY.page.loadError} />
          ) : null}
          {showEmptyState ? <CampaignsEmptyState /> : null}
          {!campaigns.isLoading && hasCampaigns ? (
            <CampaignsTable
              campaigns={filteredCampaigns}
              onRowClick={(campaignId) =>
                router.push(`/marketing/${campaignId}`)
              }
              onOpenImage={handleOpenImage}
            />
          ) : null}
        </div>
      </div>
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
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters({ status: "", from: "", to: "" })}
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
