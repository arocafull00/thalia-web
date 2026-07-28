import { Plus } from "lucide-react";

export function LoaderOrbitalVisual() {
  return (
    <div
      className="relative mb-9 grid size-[152px] place-items-center max-sm:mb-7 max-sm:scale-90"
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border border-primary/15" />
      <span className="loader-motion absolute inset-[13px] animate-boot-orbit-slow rounded-full border border-dashed border-primary/20" />
      <div className="loader-motion absolute inset-0 animate-boot-orbit">
        <span className="absolute top-[9px] left-1/2 size-2 -ml-1 rounded-full bg-primary shadow-[0_0_0_7px_var(--color-primary-subtle)]" />
      </div>
      <div className="loader-motion relative grid size-[86px] place-items-center rounded-[28px] border border-primary/10 bg-linear-to-br from-surface to-primary-subtle shadow-[0_24px_52px_color-mix(in_oklab,var(--color-primary)_16%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-surface)_90%,transparent)] animate-boot-breathe">
        <Plus
          className="size-[38px] stroke-[4] text-primary"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
