import LoginHeroPanel from "@/components/auth/login/components/login-hero-panel";
import RegisterEmployeePageClient from "@/components/auth/register-employee/page.client";

export default function RegisterEmployeePage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <RegisterEmployeePageClient />
      <LoginHeroPanel />
    </div>
  );
}
