type CalendarViewModeOptionProps = {
  label: string;
  active: boolean;
  fullWidth?: boolean;
  onClick: () => void;
};

export default function CalendarViewModeOption({
  label,
  active,
  fullWidth = false,
  onClick,
}: CalendarViewModeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full px-3 text-xs font-medium transition motion-reduce:transition-none ${fullWidth ? "flex-1" : "py-1"} ${
        active
          ? "bg-primary text-on-primary"
          : "text-ink-secondary hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
