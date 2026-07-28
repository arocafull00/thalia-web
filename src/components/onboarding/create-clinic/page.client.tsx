"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import CreateClinicForm from "@/components/onboarding/create-clinic/components/create-clinic-form";
import { useCreateClinic } from "@/components/onboarding/create-clinic/hooks/use-create-clinic";

export default function CreateClinicPageClient() {
  const router = useRouter();
  const {
    disabled,
    errors,
    isSupabaseConfigured,
    loading,
    onSignOut,
    onSubmit,
    redirectHref,
    register,
    submitting,
  } = useCreateClinic();

  useEffect(() => {
    if (!redirectHref) {
      return;
    }

    router.replace(redirectHref);
  }, [redirectHref, router]);

  if (loading) {
    return <BootLoadingScreen authLoading={loading} clinicLoading={false} />;
  }

  if (redirectHref) {
    return <RedirectScreen />;
  }

  return (
    <CreateClinicForm
      disabled={disabled}
      errors={errors}
      isSupabaseConfigured={isSupabaseConfigured}
      onSignOut={onSignOut}
      onSubmit={onSubmit}
      register={register}
      submitting={submitting}
    />
  );
}
