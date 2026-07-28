type LoaderStatusRowProps = {
  label: string;
  tag: string;
  state: "done" | "current" | "pending";
};

export function LoaderStatusRow({ label, tag, state }: LoaderStatusRowProps) {
  const isDone = state === "done";
  const isCurrent = state === "current";

  return (
    <div
      className={`grid min-h-8 grid-cols-[20px_1fr_auto] items-center gap-3 text-left text-[13px] transition-colors duration-300 ${
        isCurrent
          ? "text-ink"
          : isDone
            ? "text-ink-secondary"
            : "text-ink-muted"
      }`}
    >
      <span
        className={`grid size-[18px] place-items-center rounded-full border text-[10px] ${
          isDone
            ? "border-success-text/20 bg-success-subtle text-success-text"
            : isCurrent
              ? "loader-motion border-primary/20 bg-primary-subtle text-primary animate-boot-pulse"
              : "border-border text-transparent"
        }`}
      >
        {isDone ? "✓" : isCurrent ? "•" : ""}
      </span>
      <span>{label}</span>
      <span className="text-[11px] text-ink-muted">{tag}</span>
    </div>
  );
}
