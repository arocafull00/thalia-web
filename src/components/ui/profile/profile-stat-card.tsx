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
    <div className="rounded-card border border-border/60 bg-surface p-4">
      <Icon
        className={`size-4 ${iconClassName}`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="mt-3 text-2xl font-medium text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  );
}
