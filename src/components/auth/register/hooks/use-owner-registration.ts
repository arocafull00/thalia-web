"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import { captureEvent } from "@/lib/analytics";
import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { logger } from "@/lib/logger";
import { buildCreateClinicPayloadFromProfile } from "@/lib/owner-clinic-form";
import { buildOwnerProfileMetadata } from "@/lib/registration-metadata";
import {
  ownerRegistrationSchema,
  type OwnerRegistrationFormValues,
} from "@/lib/schemas/register-schema";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";

export type OwnerRegistrationStep = 1 | 2 | 3;

type SubmissionStage =
  "signup" | "profile" | "clinic" | "membership" | "invites";

function getDefaultValues(
  fullName: string,
  email: string,
  requiresCredentials: boolean,
): OwnerRegistrationFormValues {
  return {
    fullName,
    email,
    password: "",
    confirmPassword: "",
    clinicName: "",
    address: "",
    clinicPhone: "",
    requiresCredentials,
  };
}

function syncAuthenticatedUser() {
  return supabase.auth.getUser().then(({ data }) => {
    const currentSession = useAuthStore.getState().session;

    if (data.user && currentSession) {
      useAuthStore
        .getState()
        .setSession({ ...currentSession, user: data.user });
    }

    return data.user;
  });
}

export function useOwnerRegistration() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const fetchMemberships = useClinicStore((state) => state.fetchMemberships);
  const setActiveClinic = useClinicStore((state) => state.setActiveClinic);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const [step, setStep] = useState<OwnerRegistrationStep>(1);
  const createdClinicId = useRef<string | null>(null);

  const metadataFullName =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "";
  const hasSession = Boolean(user);

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    trigger,
    watch,
  } = useForm<OwnerRegistrationFormValues>({
    resolver: zodResolver(ownerRegistrationSchema),
    defaultValues: getDefaultValues(
      metadataFullName,
      user?.email ?? "",
      !hasSession,
    ),
  });

  const values = watch();

  const goToStep = (nextStep: OwnerRegistrationStep) => {
    clearErrors("root");
    setStep(nextStep);
  };

  const handleNext = async () => {
    clearErrors("root");

    const accountFields: (keyof OwnerRegistrationFormValues)[] = hasSession
      ? ["fullName"]
      : ["fullName", "email", "password", "confirmPassword"];
    const fields =
      step === 1
        ? accountFields
        : ([
            "clinicName",
            "address",
            "clinicPhone",
          ] satisfies (keyof OwnerRegistrationFormValues)[]);
    const valid = await trigger(fields, { shouldFocus: true });

    if (!valid) {
      return;
    }

    setStep((current) => (current === 1 ? 2 : 3));
  };

  const handleBack = () => {
    clearErrors("root");
    setStep((current) => (current === 3 ? 2 : 1));
  };

  const submit = handleSubmit(async (data) => {
    let stage: SubmissionStage = "signup";

    try {
      setIntent("owner");
      let activeUser = user;

      if (!activeUser) {
        await signUp(data.email, data.password, {
          full_name: data.fullName,
        });
        activeUser = await waitForAuthSessionReady();

        if (!activeUser) {
          throw new Error(REGISTER_OWNER_COPY.errors.sessionUnavailable);
        }
      }

      stage = "profile";
      const { error: profileError } = await supabase.auth.updateUser({
        data: buildOwnerProfileMetadata(data.fullName),
      });

      if (profileError) {
        throw profileError;
      }

      await syncAuthenticatedUser();

      stage = "clinic";
      let clinicId = createdClinicId.current;

      if (!clinicId) {
        const payload = buildCreateClinicPayloadFromProfile(
          {
            clinicName: data.clinicName,
            address: data.address,
            clinicPhone: data.clinicPhone,
          },
          data.fullName,
        );

        if (!payload) {
          throw new Error(REGISTER_OWNER_COPY.errors.createFailed);
        }

        const { data: clinicData, error: clinicError } =
          await supabase.functions.invoke<{ clinicId: string }>(
            "create-clinic",
            { body: payload },
          );

        if (clinicError || !clinicData?.clinicId) {
          throw (
            clinicError ?? new Error(REGISTER_OWNER_COPY.errors.createFailed)
          );
        }

        clinicId = clinicData.clinicId;
        createdClinicId.current = clinicId;
        captureEvent("clinic_created", { clinicId });
      }

      stage = "membership";
      await fetchMemberships(activeUser.id);
      setActiveClinic(clinicId);

      stage = "invites";
      const { error: invitesError } = await supabase.auth.updateUser({
        data: { registration_pending_invites: true },
      });

      if (invitesError) {
        throw invitesError;
      }

      await syncAuthenticatedUser();
      await waitForAuthSessionReady();
      router.replace("/invite-team");
    } catch (cause) {
      const message =
        cause instanceof Error &&
        cause.message === REGISTER_OWNER_COPY.errors.sessionUnavailable
          ? cause.message
          : stage === "signup"
            ? getAuthErrorMessage(cause)
            : REGISTER_OWNER_COPY.errors.createFailed;

      if (stage !== "signup") {
        logger.captureException(cause, {
          action: "owner-registration",
          stage,
          userId: user?.id,
        });
      }

      setError("root", { message });
      toast.error(message);
    }
  });

  return {
    disabled: isSubmitting || !isSupabaseConfigured,
    errors,
    hasSession,
    isSupabaseConfigured,
    onBack: handleBack,
    onNext: handleNext,
    onSubmit: submit,
    register,
    setStep: goToStep,
    step,
    submitting: isSubmitting,
    values,
  };
}
