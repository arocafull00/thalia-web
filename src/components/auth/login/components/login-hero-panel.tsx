import LoginHeroIllustration from "@/components/auth/login/components/login-hero-illustration";
import { LOGIN_COPY } from "@/components/auth/login/login-copy";

const HERO_INDICATORS = [0, 1, 2, 3];

export default function LoginHeroPanel() {
  return (
    <section className="relative hidden min-h-screen flex-1 flex-col overflow-hidden bg-primary lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-on-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-on-primary)_1px,transparent_1px)] bg-size-[48px_48px] opacity-10"
      />

      <div className="relative z-1 flex flex-1 items-center justify-center p-10">
        <LoginHeroIllustration />
      </div>

      <div className="relative z-10 space-y-4 px-10 pb-12 text-center">
        <h2 className="mx-auto max-w-md text-2xl font-medium text-on-primary">
          {LOGIN_COPY.hero.headline}
        </h2>
        <p className="mx-auto max-w-lg text-sm text-on-primary/80">{LOGIN_COPY.hero.body}</p>
        <div className="flex justify-center gap-2 pt-2">
          {HERO_INDICATORS.map((index) => (
            <span
              key={index}
              className={`h-1 rounded-full ${index === 0 ? "w-8 bg-on-primary" : "w-4 bg-on-primary/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
