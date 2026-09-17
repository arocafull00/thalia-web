import Image from "next/image";

export default function SubscriptionPaywallHero() {
  return (
    <section className="relative hidden min-h-screen flex-1 items-center justify-center overflow-hidden bg-primary lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-on-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-on-primary)_1px,transparent_1px)] bg-size-[48px_48px] opacity-10"
      />
      <div className="relative z-1 flex w-full items-center justify-center p-10 xl:p-16">
        <Image
          src="/img/paywall.svg"
          alt=""
          width={1200}
          height={1200}
          unoptimized
          className="h-auto w-[125%] max-w-3xl -translate-y-[3%]"
        />
      </div>
    </section>
  );
}
