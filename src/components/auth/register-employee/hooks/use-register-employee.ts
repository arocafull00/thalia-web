import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { getRegisterCopy } from "@/copy/register-employee-copy";
import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import {
  buildEmployeeProfileMetadata,
  EMPLOYEE_REGISTRATION_STEP_COUNT,
} from "@/lib/registration-metadata";
import {
  registerEmployeeSchema,
  type RegisterEmployeeFormValues,
} from "@/lib/schemas/register-schema";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

function createDefaultValues(
  fullName: string,
  email: string,
  requiresCredentials: boolean,
): RegisterEmployeeFormValues {
  return {
    fullName,
    email,
    password: "",
    confirmPassword: "",
    requiresCredentials,
  };
}

export function useRegisterEmployee() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const pendingToken = usePendingInviteStore((state) => state.token);
  const invitationEmail = usePendingInviteStore(
    (state) => state.invitationEmail,
  );
  const { href, ready } = usePostAuthRedirect(Boolean(user));

  const metadataFullName =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "";
  const isEmployeeRegistration =
    intent === "employee" || Boolean(pendingToken) || Boolean(invitationEmail);
  const employeeViaEmail = Boolean(invitationEmail);
  const stepTotal = employeeViaEmail ? 2 : EMPLOYEE_REGISTRATION_STEP_COUNT;
  const currentStep = employeeViaEmail ? 2 : 1;
  const hasSession = Boolean(user);
  const copy = getRegisterCopy("employee", hasSession);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterEmployeeFormValues>({
    resolver: zodResolver(registerEmployeeSchema),
    defaultValues: createDefaultValues(
      metadataFullName,
      invitationEmail ?? "",
      !hasSession,
    ),
  });

  useEffect(() => {
    reset(
      createDefaultValues(metadataFullName, invitationEmail ?? "", !hasSession),
    );
  }, [hasSession, invitationEmail, metadataFullName, reset]);

  const authDisabled = isSubmitting || !isSupabaseConfigured;
  const shouldRedirect = Boolean(
    user && ready && href && href !== "/register-employee",
  );
  const redirectHref = !isEmployeeRegistration
    ? "/register"
    : shouldRedirect
      ? href
      : null;
  const isRedirecting =
    shouldRedirect || Boolean(user && isEmployeeRegistration && pendingToken);

  const handleContinue = handleSubmit(async (data) => {
    try {
      setIntent("employee");

      if (!hasSession) {
        await signUp(data.email, data.password, {
          full_name: data.fullName,
        });
        await waitForAuthSessionReady();
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: buildEmployeeProfileMetadata(data.fullName),
      });

      if (updateError) {
        throw updateError;
      }

      const { data: freshUserData } = await supabase.auth.getUser();

      if (freshUserData.user) {
        const currentSession = useAuthStore.getState().session;

        if (currentSession) {
          useAuthStore
            .getState()
            .setSession({ ...currentSession, user: freshUserData.user });
        }
      }

      if (pendingToken) {
        router.push(`/invite/${pendingToken}`);
      }
    } catch (cause) {
      setError("root", { message: getAuthErrorMessage(cause) });
    }
  });

  return {
    authDisabled,
    copy,
    currentStep,
    errors,
    hasSession,
    invitationEmail,
    isRedirecting,
    isSupabaseConfigured,
    onContinue: handleContinue,
    redirectHref,
    register,
    stepTotal,
    submitting: isSubmitting,
  };
}
