"use client";

import { ImageOff } from "lucide-react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";

const { list, messagePreview } = MARKETING_COPY;

const THUMB_CLASSNAME = "size-12 shrink-0 rounded-lg object-cover";

type CampaignImageCellProps = {
  storageKey: string | null;
  onOpen: (storageKey: string) => void;
};

export default function CampaignImageCell({
  storageKey,
  onOpen,
}: CampaignImageCellProps) {
  const { url, hasError } = useCampaignImageUrl(storageKey);

  if (!storageKey) {
    return (
      <span className="flex text-ink-muted" title={list.noImage}>
        <ImageOff size={16} strokeWidth={1.5} aria-label={list.noImage} />
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={list.viewImage}
      title={list.viewImage}
      data-testid="campaign-image-trigger"
      className="flex rounded-lg outline-none ring-primary focus-visible:ring-2"
      onClick={(event) => {
        // La fila navega al detalle: sin esto, abrir la imagen te sacaría de
        // la lista antes de poder verla.
        event.stopPropagation();
        onOpen(storageKey);
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={messagePreview.imageAlt}
          className={THUMB_CLASSNAME}
        />
      ) : (
        // Hueco del mismo tamaño mientras se firma la URL, para que la fila no
        // dé un salto de altura al cargar.
        <span
          className={`${THUMB_CLASSNAME} flex items-center justify-center bg-surface-secondary text-ink-muted`}
        >
          {hasError ? (
            <ImageOff size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : null}
        </span>
      )}
    </button>
  );
}
