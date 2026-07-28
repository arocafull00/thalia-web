"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { REGISTER_COPY } from "@/copy/register-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { isOwnerRegistration } from "@/lib/registration-metadata";
import {
  registerInvitationEmailSchema,
  type RegisterInvitationEmailFormValues,
} from "@/lib/schemas/register-schema";
import { supabase } from "@/lib/supabase";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

type RegisterStep = "pick" | "employee-email" | "owner";

export function useRegisterType() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const clearIntent = useOnboardingIntentStore((state) => state.clearIntent);
  const setToken = usePendingInviteStore((state) => state.setToken);

  const [selectedStep, setSelectedStep] = useState<RegisterStep>("pick");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInvitationEmailFormValues>({
    resolver: zodResolver(registerInvitationEmailSchema),
    defaultValues: { email: "" },
  });

  const shouldResumeOwner = intent === "owner" || isOwnerRegistration(user);
  const step =
    selectedStep === "pick" && shouldResumeOwner ? "owner" : selectedStep;

  const handlePickOwner = () => {
    setIntent("owner");
    setSelectedStep("owner");
  };

  const handlePickEmployee = () => {
    setSelectedStep("employee-email");
  };

  const handleBack = () => {
    usePendingInviteStore.getState().clearToken();
    setSelectedStep("pick");
    reset();
  };

  const handleOwnerExit = () => {
    clearIntent();
    setSelectedStep("pick");
  };

  const handleEmployeeEmailSubmit = handleSubmit(async ({ email }) => {
    try {
      const { data, error: queryError } = await supabase
        .from("invitation_tokens")
        .select("token, email")
        .is("used_at", null)
        .ilike("email", email)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (!data) {
        setError("root", {
          message: REGISTER_COPY.employeeEmail.errors.notInvited,
        });
        return;
      }

      setIntent("employee");
      setToken(data.token, data.email);
      router.push("/register-employee");
    } catch {
      setError("root", {
        message: REGISTER_COPY.employeeEmail.errors.lookupFailed,
      });
    }
  });

  const handleSignOut = () => {
    usePendingInviteStore.getState().clearToken();
    clearIntent();
    if (user) {
      void signOut();
    } else {
      router.replace("/login");
    }
  };

  return {
    step,
    emailRegister: register("email"),
    emailError: errors.email?.message,
    error: errors.root?.message ?? null,
    submitting: isSubmitting,
    handlePickOwner,
    handlePickEmployee,
    handleBack,
    handleEmployeeEmailSubmit,
    handleOwnerExit,
    handleSignOut,
  };
}
