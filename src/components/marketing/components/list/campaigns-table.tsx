"use client";

import { useMemo } from "react";

import { buildCampaignsColumns } from "@/components/marketing/components/list/campaigns-columns";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { DataTable } from "@/components/ui/data-table";
import type { Campaign } from "@/types/database.types";

type CampaignsTableProps = {
  campaigns: Campaign[];
  onRowClick: (id: string) => void;
  onOpenImage: (storageKey: string) => void;
};

export default function CampaignsTable({
  campaigns,
  onRowClick,
  onOpenImage,
}: CampaignsTableProps) {
  const columns = useMemo(
    () => buildCampaignsColumns({ onOpenImage }),
    [onOpenImage],
  );

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      enablePagination
      enableSorting
      pageSize={10}
      emptyMessage={MARKETING_COPY.list.emptyFiltered}
      onRowClick={(campaign) => onRowClick(campaign.id)}
    />
  );
}
