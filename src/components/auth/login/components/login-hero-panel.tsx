import LoginHeroIllustration from "@/components/auth/login/components/login-hero-illustration";
import { LOGIN_COPY } from "@/copy/login-copy";

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
        <p className="mx-auto max-w-lg text-sm text-on-primary/80">
          {LOGIN_COPY.hero.body}
        </p>
      </div>
    </section>
  );
}
