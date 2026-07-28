import { Home } from "lucide-react";

export function LoaderRedirectVisual() {
  return (
    <div
      className="relative mb-10 h-[118px] w-[190px] max-sm:mb-8 max-sm:scale-90"
      aria-hidden="true"
    >
      <div className="absolute top-1/2 right-2 left-2 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-1/2 left-0 grid size-[66px] -mt-[33px] place-items-center rounded-[22px] border border-border bg-surface shadow-[0_16px_36px_color-mix(in_oklab,var(--color-ink)_10%,transparent)]">
        <Home className="size-[25px] text-ink-secondary" strokeWidth={1.7} />
      </div>
      <span className="loader-motion absolute top-1/2 -mt-[5.5px] size-[11px] rounded-full bg-primary shadow-[0_0_0_7px_color-mix(in_oklab,var(--color-primary)_10%,transparent),0_0_24px_color-mix(in_oklab,var(--color-primary)_48%,transparent)] animate-boot-travel" />
      <div className="absolute top-1/2 right-0 grid size-[66px] -mt-[33px] place-items-center rounded-[22px] border border-primary/15 bg-linear-to-br from-surface to-primary-subtle shadow-[0_16px_36px_color-mix(in_oklab,var(--color-ink)_10%,transparent)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon.png"
          alt=""
          width={28}
          height={28}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
