import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";
import LoginPageClient from "@/components/auth/login/page.client";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <LoginPageClient />
      <LoginHeroPanel />
    </div>
  );
}
