"use client";

import type { ColumnDef } from "@tanstack/react-table";

import CampaignDateCell from "@/components/marketing/components/list/campaign-date-cell";
import CampaignImageCell from "@/components/marketing/components/list/campaign-image-cell";
import CampaignStatusBadge from "@/components/marketing/components/list/campaign-status-badge";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { truncateText } from "@/lib/format";
import type { Campaign } from "@/types/database.types";

const { columns } = MARKETING_COPY.list;

const CONTENT_MAX_LENGTH = 50;

type BuildCampaignsColumnsOptions = {
  onOpenImage: (storageKey: string) => void;
};

export function buildCampaignsColumns({
  onOpenImage,
}: BuildCampaignsColumnsOptions): ColumnDef<Campaign>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.title} />
      ),
      cell: ({ row }) => (
        <span className="block truncate font-medium text-ink">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "content",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.content} />
      ),
      cell: ({ row }) => (
        <span className="block max-w-md text-sm text-ink-secondary">
          {truncateText(row.original.content, CONTENT_MAX_LENGTH)}
        </span>
      ),
    },
    {
      id: "image",
      header: () => <span className="text-sm">{columns.image}</span>,
      cell: ({ row }) => (
        <CampaignImageCell
          storageKey={row.original.image_url}
          onOpen={onOpenImage}
        />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.status} />
      ),
      cell: ({ row }) => <CampaignStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.date} />
      ),
      cell: ({ row }) => <CampaignDateCell campaign={row.original} />,
    },
  ];
}
