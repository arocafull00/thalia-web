import LoginPageClient from "@/components/auth/login/page.client";
import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <LoginPageClient />
      <LoginHeroPanel />
    </div>
  );
}
