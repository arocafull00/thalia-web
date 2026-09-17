import { LOGIN_COPY } from "@/copy/login-copy";

export default function LoginBranding() {
  return (
    <div className="space-y-2 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.png"
        alt="Thalia"
        width={56}
        height={56}
        className="mx-auto mb-4 rounded-xl"
      />
      <h1 className="text-2xl font-medium text-ink">{LOGIN_COPY.title}</h1>
      <p className="text-sm text-ink-secondary">{LOGIN_COPY.subtitle}</p>
    </div>
  );
}
