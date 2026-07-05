"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { REGISTER_COPY } from "@/copy/register-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

type RegisterStep = "pick" | "employee-email";

export function useRegisterType() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const setToken = usePendingInviteStore((state) => state.setToken);

  const [step, setStep] = useState<RegisterStep>("pick");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickOwner = () => {
    setIntent("owner");
    router.push("/register-employee");
  };

  const handlePickEmployee = () => {
    setStep("employee-email");
  };

  const handleBack = () => {
    usePendingInviteStore.getState().clearToken();
    setStep("pick");
    setEmail("");
    setError(null);
  };

  const handleEmployeeEmailSubmit = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      setError(REGISTER_COPY.employeeEmail.errors.emailRequired);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const { data, error: queryError } = await supabase
        .from("invitation_tokens")
        .select("token, email")
        .is("used_at", null)
        .ilike("email", trimmed)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (!data) {
        setError(REGISTER_COPY.employeeEmail.errors.notInvited);
        return;
      }

      setIntent("employee");
      setToken(data.token, data.email);
      router.push("/register-employee");
    } catch {
      setError(REGISTER_COPY.employeeEmail.errors.lookupFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    usePendingInviteStore.getState().clearToken();
    if (user) {
      void signOut();
    } else {
      router.replace("/login");
    }
  };

  return {
    step,
    email,
    error,
    submitting,
    setEmail,
    handlePickOwner,
    handlePickEmployee,
    handleBack,
    handleEmployeeEmailSubmit,
    handleSignOut,
  };
}
