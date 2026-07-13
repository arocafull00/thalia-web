import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ProfileInfoRowProps = {
  icon: LucideIcon;
  iconLabel: string;
  label?: string;
  value?: string | null;
  children?: ReactNode;
};

export function ProfileInfoRow({
  icon: Icon,
  iconLabel,
  label,
  value,
  children,
}: ProfileInfoRowProps) {
  const content = children ?? (value?.trim() ? value : "—");

  return (
    <div className="flex items-start gap-3 py-3">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-ink-muted"
        aria-label={iconLabel}
      />
      <div className="min-w-0 flex-1">
        {label ? (
          <p className="mb-0.5 text-xs text-ink-muted">{label}</p>
        ) : null}
        <div className="text-sm text-ink">{content}</div>
      </div>
    </div>
  );
}
