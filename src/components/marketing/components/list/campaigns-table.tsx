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
  /** Paginación en servidor: `campaigns` es ya la página visible. */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function CampaignsTable({
  campaigns,
  onRowClick,
  onOpenImage,
  pagination,
}: CampaignsTableProps) {
  const columns = useMemo(
    () => buildCampaignsColumns({ onOpenImage }),
    [onOpenImage],
  );

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      manualPagination={pagination}
      emptyMessage={MARKETING_COPY.list.emptyFiltered}
      onRowClick={(campaign) => onRowClick(campaign.id)}
    />
  );
}
