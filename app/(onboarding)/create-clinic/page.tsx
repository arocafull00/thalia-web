import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";
import CreateClinicPageClient from "@/components/onboarding/create-clinic/page.client";

export default function CreateClinicPage() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <CreateClinicPageClient />
      <LoginHeroPanel />
    </div>
  );
}
