import CampaignCard from "@/components/marketing/components/list/campaign-card";
import CampaignsPagination from "@/components/marketing/components/list/campaigns-pagination";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@/types/database.types";

type CampaignsGalleryProps = {
  campaigns: Campaign[];
  onClearFilters: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function CampaignsGallery({
  campaigns,
  onClearFilters,
  pagination,
}: CampaignsGalleryProps) {
  return (
    <section
      aria-labelledby="campaigns-heading"
      className="space-y-5 pb-2 pt-2"
    >
      <div className="space-y-1">
        <h1
          id="campaigns-heading"
          className="text-2xl font-medium tracking-tight text-ink"
        >
          {MARKETING_COPY.page.campaignsTitle}
        </h1>
        <p className="text-sm text-ink-secondary">
          {MARKETING_COPY.list.count(pagination.total)}
        </p>
      </div>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-medium text-ink">
            {MARKETING_COPY.list.emptyFiltered}
          </p>
          <p className="max-w-sm text-sm text-ink-secondary">
            {MARKETING_COPY.list.emptyFilteredHint}
          </p>
          <Button type="button" variant="link" onClick={onClearFilters}>
            {MARKETING_COPY.list.clearFilters}
          </Button>
        </div>
      )}
      {pagination.total > 0 ? <CampaignsPagination {...pagination} /> : null}
    </section>
  );
}
