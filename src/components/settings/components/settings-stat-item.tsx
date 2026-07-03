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
    <div className="flex items-center justify-between gap-4 py-4">
      <p className="text-sm text-ink-secondary">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${valueToneClass}`}>
        {value}
      </p>
    </div>
  );
}
