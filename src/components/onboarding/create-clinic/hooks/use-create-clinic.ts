"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { CREATE_CLINIC_COPY } from "@/copy/create-clinic-copy";
import { captureEvent } from "@/lib/analytics";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import { logger } from "@/lib/logger";
import { buildCreateClinicPayloadFromProfile } from "@/lib/owner-clinic-form";
import { hasRegistrationProfile } from "@/lib/registration-metadata";
import {
  createClinicSchema,
  type CreateClinicFormValues,
} from "@/lib/schemas/register-schema";
import { supabase } from "@/lib/supabase";
import { useClinicStore } from "@/stores/clinic-store";

const defaultValues: CreateClinicFormValues = {
  clinicName: "",
  address: "",
  clinicPhone: "",
};

export function useCreateClinic() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const fetchMemberships = useClinicStore((state) => state.fetchMemberships);
  const setActiveClinic = useClinicStore((state) => state.setActiveClinic);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateClinicFormValues>({
    resolver: zodResolver(createClinicSchema),
    defaultValues,
  });

  const profileIncomplete = Boolean(user && !hasRegistrationProfile(user));
  const shouldRedirectAway = Boolean(
    user && ready && href && href !== "/create-clinic",
  );
  const redirectHref = !user
    ? "/login"
    : profileIncomplete
      ? "/register-employee"
      : shouldRedirectAway
        ? href
        : null;

  const disabled = isSubmitting || !isSupabaseConfigured;

  const onSubmit = handleSubmit(async (data) => {
    const fullName =
      (typeof user?.user_metadata.full_name === "string" &&
        user.user_metadata.full_name.trim()) ||
      "";

    if (!fullName) {
      setError("root", {
        message: CREATE_CLINIC_COPY.errors.profileIncomplete,
      });
      toast.error(CREATE_CLINIC_COPY.errors.profileIncomplete);
      return;
    }

    const payload = buildCreateClinicPayloadFromProfile(
      {
        clinicName: data.clinicName,
        address: data.address,
        clinicPhone: data.clinicPhone,
      },
      fullName,
    );

    if (!payload) {
      setError("root", { message: CREATE_CLINIC_COPY.errors.createFailed });
      toast.error(CREATE_CLINIC_COPY.errors.createFailed);
      return;
    }

    try {
      const { data: clinicData, error: invokeError } =
        await supabase.functions.invoke<{ clinicId: string }>("create-clinic", {
          body: payload,
        });

      if (invokeError) {
        throw invokeError;
      }

      if (!clinicData?.clinicId) {
        throw new Error(CREATE_CLINIC_COPY.errors.createFailed);
      }

      captureEvent("clinic_created", { clinicId: clinicData.clinicId });

      if (user?.id) {
        await fetchMemberships(user.id);
        setActiveClinic(clinicData.clinicId);
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { registration_pending_invites: true },
      });

      if (updateError) {
        throw updateError;
      }

      await waitForAuthSessionReady();
      router.replace("/invite-team");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : CREATE_CLINIC_COPY.errors.createFailed;

      logger.captureException(cause, {
        action: "create-clinic",
        userId: user?.id,
      });
      setError("root", { message });
      toast.error(message);
    }
  });

  return {
    disabled,
    errors,
    isSupabaseConfigured,
    loading,
    onSignOut: signOut,
    onSubmit,
    redirectHref,
    register,
    submitting: isSubmitting,
  };
}
