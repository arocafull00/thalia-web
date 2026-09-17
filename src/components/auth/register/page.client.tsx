"use client";

import RegisterFlow from "@/components/auth/register/register-flow";

export default function RegisterPageClient() {
  return (
    <section className="flex min-h-screen flex-1 flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
        <div className="w-full max-w-130">
          <RegisterFlow showExit />
        </div>
      </div>
    </section>
  );
}
