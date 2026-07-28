type LoaderProgressBarProps = {
  ariaLabel: string;
  progressValue: number;
};

export function LoaderProgressBar({
  ariaLabel,
  progressValue,
}: LoaderProgressBarProps) {
  return (
    <div
      className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-primary/10"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValue}
    >
      <div className="loader-motion h-full rounded-full bg-linear-to-r from-primary to-primary-light shadow-[0_0_18px_color-mix(in_oklab,var(--color-primary)_38%,transparent)] animate-boot-progress" />
    </div>
  );
}
