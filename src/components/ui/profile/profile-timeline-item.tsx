import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export type ProfileTimelineItem = {
  id: string;
  date: string;
  monthGroup: string;
  time: string;
  primary: string;
  secondary?: string;
  statusLabel: string;
  statusVariant: "default" | "success" | "danger" | "warning";
};

type ProfileTimelineItemRowProps = {
  item: ProfileTimelineItem;
};

const statusVariants = {
  default: "default",
  success: "success",
  danger: "danger",
  warning: "warning",
} as const;

export default function ProfileTimelineItemRow({
  item,
}: ProfileTimelineItemRowProps) {
  return (
    <li className="relative border-b border-border-subtle last:border-b-0">
      <Link
        href={`/appointments/${item.id}`}
        className="relative flex flex-wrap items-start justify-between gap-4 py-4 transition hover:bg-[var(--hover-overlay)]"
      >
        <span
          className="absolute top-5 -left-4 size-2 rounded-full bg-primary/40"
          aria-hidden="true"
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-ink">{item.primary}</p>
          {item.secondary ? (
            <p className="text-sm text-ink-secondary">{item.secondary}</p>
          ) : null}
          <p className="text-xs text-ink-muted">
            {item.date} · {item.time}
          </p>
        </div>
        <Badge
          variant={statusVariants[item.statusVariant]}
          className="shrink-0"
        >
          {item.statusLabel}
        </Badge>
      </Link>
    </li>
  );
}
