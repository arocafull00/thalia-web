import { cn } from "@/lib/utils";

type LoaderSpinnerSize = "sm" | "lg";

type LoaderSpinnerProps = {
  size?: LoaderSpinnerSize;
};

const SPINNER_SIZES: Record<
  LoaderSpinnerSize,
  { root: string; track: string; dot: string; arc: string }
> = {
  sm: {
    root: "size-[72px] [--loader-ring-width:4px]",
    track: "border-4",
    dot: "size-1",
    arc: "border-2",
  },
  lg: {
    root: "size-[152px] [--loader-ring-width:6px]",
    track: "border-[6px]",
    dot: "size-1.5",
    arc: "border-[3px]",
  },
};

export function LoaderSpinner({ size = "lg" }: LoaderSpinnerProps) {
  const styles = SPINNER_SIZES[size];

  return (
    <span
      className={cn("relative block shrink-0", styles.root)}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full border-primary/10",
          styles.track,
        )}
      />
      <span className="loader-motion absolute inset-0 animate-boot-spin">
        <span className="loader-ring absolute inset-0" />
        <span
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-primary)_14%,transparent)]",
            styles.dot,
          )}
        />
      </span>
      <span
        className={cn(
          "loader-motion absolute inset-[12.5%] animate-boot-spin-reverse rounded-full border-transparent border-t-primary/45 border-r-primary/15",
          styles.arc,
        )}
      />
      <span className="loader-motion absolute inset-[24%] animate-boot-breathe rounded-full border border-primary/10 bg-primary-subtle" />
    </span>
  );
}
