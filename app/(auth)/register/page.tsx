import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";
import RegisterPageClient from "@/components/auth/register/page.client";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <RegisterPageClient />
      <LoginHeroPanel />
    </div>
  );
}
