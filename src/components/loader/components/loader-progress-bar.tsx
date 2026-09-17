type LoaderProgressBarProps = {
  ariaLabel: string;
};

export function LoaderProgressBar({ ariaLabel }: LoaderProgressBarProps) {
  return (
    <div
      className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-primary/10"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuetext="Cargando"
    >
      <div className="loader-motion h-full w-1/3 rounded-full bg-primary animate-boot-progress-indeterminate" />
    </div>
  );
}
