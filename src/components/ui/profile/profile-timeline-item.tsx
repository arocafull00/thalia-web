import Link from "next/link";

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

const dotClassNames = {
  default: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
} as const;

export default function ProfileTimelineItemRow({
  item,
}: ProfileTimelineItemRowProps) {
  return (
    <li className="relative border-b border-border-subtle last:border-b-0">
      <Link
        href={`/appointments/${item.id}`}
        className="relative flex flex-wrap items-start justify-between gap-2 py-3 transition hover:bg-canvas"
      >
        <span
          className={`absolute top-[18px] -left-4 size-2.5 rounded-full ${dotClassNames[item.statusVariant]}`}
          aria-hidden="true"
        />
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-ink">{item.primary}</p>
          {item.secondary ? (
            <p className="text-sm text-ink-secondary">{item.secondary}</p>
          ) : null}
          <p className="text-xs text-ink-muted">
            {item.date} · {item.time}
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide text-ink-secondary">
          {item.statusLabel}
        </span>
      </Link>
    </li>
  );
}
