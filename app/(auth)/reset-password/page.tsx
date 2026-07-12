import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";
import ResetPasswordPageClient from "@/components/auth/reset-password/page.client";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <ResetPasswordPageClient />
      <LoginHeroPanel />
    </div>
  );
}
