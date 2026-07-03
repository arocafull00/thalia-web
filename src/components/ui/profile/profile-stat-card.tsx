import type { LucideIcon } from "lucide-react";

type ProfileStatCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number;
};

export function ProfileStatCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: ProfileStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Icon className={`size-5 ${iconClassName}`} aria-hidden="true" />
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </p>
    </div>
  );
}
