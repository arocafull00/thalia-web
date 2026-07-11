import ForgotPasswordPageClient from "@/components/auth/forgot-password/page.client";
import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <ForgotPasswordPageClient />
      <LoginHeroPanel />
    </div>
  );
}
