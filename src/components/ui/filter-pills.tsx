type FilterPillOption = {
  label: string;
  value: string;
};

type FilterPillsProps = {
  options: FilterPillOption[];
  active: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

export default function FilterPills({
  options,
  active,
  onChange,
  ariaLabel,
}: FilterPillsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2 motion-reduce:transition-none"
    >
      {options.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none ${
              isActive
                ? "bg-primary-subtle text-primary"
                : "bg-surface text-ink-secondary ring-1 ring-border/60 hover:bg-[var(--hover-overlay)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
