"use client";

import { ImageOff, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CampaignDateCell from "@/components/marketing/components/list/campaign-date-cell";
import CampaignStatusBadge from "@/components/marketing/components/list/campaign-status-badge";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { truncateText } from "@/lib/format";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";
import type { Campaign } from "@/types/database.types";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { url, hasError } = useCampaignImageUrl(campaign.image_url);

  return (
    <article
      aria-label={campaign.title}
      data-testid="campaign-card"
      className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary focus-within:border-primary motion-reduce:transition-none"
    >
      <Link
        href={`/marketing/${campaign.id}`}
        aria-label={MARKETING_COPY.list.viewDetail(campaign.title)}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <div
          data-testid="campaign-card-image"
          className="relative aspect-[16/9] overflow-hidden bg-primary-subtle"
        >
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center text-primary"
              aria-hidden="true"
            >
              {hasError ? (
                <ImageOff size={24} strokeWidth={1.5} />
              ) : (
                <Megaphone size={28} strokeWidth={1.25} />
              )}
            </div>
          )}
          <div className="absolute left-2.5 top-2.5">
            <CampaignStatusBadge status={campaign.status} />
          </div>
        </div>
        <div className="space-y-1.5 p-3">
          <h2 className="line-clamp-1 text-sm font-medium capitalize text-ink">
            {campaign.title}
          </h2>
          <p className="line-clamp-2 text-xs leading-snug text-ink-secondary">
            {truncateText(campaign.content, 90)}
          </p>
          <div className="pt-1">
            <CampaignDateCell campaign={campaign} />
          </div>
        </div>
      </Link>
    </article>
  );
}
