import { UserRound } from "lucide-react";
import Image from "next/image";

import type { TreatmentImageGalleryItem } from "@/components/treatments/treatment-images.types";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";

type TreatmentImageThumbnailProps = {
  item: TreatmentImageGalleryItem;
  onView: (imageId: string) => void;
};

export default function TreatmentImageThumbnail({
  item,
  onView,
}: TreatmentImageThumbnailProps) {
  return (
    <article className="min-w-0 space-y-2">
      <button
        type="button"
        className="group relative aspect-square w-full overflow-hidden rounded-xl bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={TREATMENT_DETAIL_COPY.images.viewImage(item.patientName)}
        onClick={() => onView(item.image.id)}
      >
        {item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 animate-pulse bg-border" />
        )}
        <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
      </button>

      <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-ink">
        <UserRound
          className="size-3.5 shrink-0 text-ink-muted"
          aria-hidden="true"
        />
        <span className="truncate">{item.patientName}</span>
      </p>
    </article>
  );
}
