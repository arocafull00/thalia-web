type SettingsStatItemProps = {
  label: string;
  tone?: "default" | "success" | "warning";
  value: string;
};

export default function SettingsStatItem({
  label,
  tone = "default",
  value,
}: SettingsStatItemProps) {
  const valueToneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : "text-ink";

  return (
    <div className="min-w-0 flex-1 px-0 py-3 first:pt-0 last:pb-0 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0">
      <p
        className={`text-3xl font-semibold tabular-nums tracking-tight ${valueToneClass}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
    </div>
  );
}
