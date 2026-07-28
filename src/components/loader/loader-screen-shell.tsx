import type { ReactNode } from "react";

type LoaderScreenShellProps = {
  children: ReactNode;
  footer: string;
};

export function LoaderScreenShell({
  children,
  footer,
}: LoaderScreenShellProps) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,var(--color-primary-subtle),transparent_28rem),radial-gradient(circle_at_90%_82%,var(--color-primary-light),transparent_30rem)]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-full max-w-[560px] flex-col items-center text-center">
        {children}
      </div>
      <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs text-ink-muted">
        {footer}
      </p>
    </div>
  );
}
