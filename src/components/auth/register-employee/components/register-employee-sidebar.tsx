import {
  getSidebarCopy,
  REGISTER_EMPLOYEE_SIDEBAR_COPY,
} from "@/components/auth/register-employee/register-employee-copy";
import type { OnboardingIntent } from "@/stores/onboarding-intent-store";

type RegisterEmployeeSidebarProps = {
  intent: OnboardingIntent;
  stepTotal: number;
};

export default function RegisterEmployeeSidebar({ intent, stepTotal }: RegisterEmployeeSidebarProps) {
  const copy = getSidebarCopy(intent);
  const progressWidth = `${(1 / stepTotal) * 100}%`;

  return (
    <section className="hidden flex-1 flex-col justify-center gap-6 border-r border-zinc-200 bg-white p-10 lg:flex">
      <h1 className="text-5xl font-medium tracking-tight text-zinc-900">{REGISTER_EMPLOYEE_SIDEBAR_COPY.brand}</h1>
      <p className="max-w-md text-lg text-zinc-500">{copy.tagline}</p>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {REGISTER_EMPLOYEE_SIDEBAR_COPY.stepLabel(1, stepTotal)}
        </p>
        <div className="h-1 w-60 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-zinc-900" style={{ width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}
