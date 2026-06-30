import { useState } from "react";

import {
  getRegisterCopy,
  REGISTER_EMPLOYEE_FORM_COPY,
} from "@/copy/register-employee-copy";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import {
  buildOwnerProfileMetadata,
  EMPLOYEE_REGISTRATION_STEP_COUNT,
  OWNER_REGISTRATION_STEP_COUNT,
} from "@/lib/registration-metadata";
import { supabase } from "@/lib/supabase";
import {
  useOnboardingIntentStore,
  type OnboardingIntent,
} from "@/stores/onboarding-intent-store";

export function useRegisterEmployee() {
  const { signUp, user } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const [fullNameOverride, setFullNameOverride] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const metadataFullName =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "";
  const fullName = fullNameOverride ?? metadataFullName;
  const resolvedIntent: OnboardingIntent = intent ?? "owner";
  const isOwner = resolvedIntent === "owner";
  const stepTotal = isOwner
    ? OWNER_REGISTRATION_STEP_COUNT
    : EMPLOYEE_REGISTRATION_STEP_COUNT;
  const hasSession = Boolean(user);
  const copy = getRegisterCopy(resolvedIntent, hasSession);
  const authDisabled = submitting || !isSupabaseConfigured;
  const shouldRedirect = Boolean(
    user && ready && href && href !== "/register-employee",
  );
  const redirectHref = shouldRedirect ? href : null;

  const handleContinue = async () => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError(REGISTER_EMPLOYEE_FORM_COPY.errors.fullNameRequired);
      return;
    }

    if (!hasSession) {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError(REGISTER_EMPLOYEE_FORM_COPY.errors.credentialsRequired);
        return;
      }
    }

    setError(null);
    setSubmitting(true);

    try {
      setIntent(resolvedIntent);

      if (!hasSession) {
        await signUp(email.trim(), password.trim(), { full_name: trimmedName });
        await waitForAuthSessionReady();
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: buildOwnerProfileMetadata(trimmedName),
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      await waitForAuthSessionReady();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : REGISTER_EMPLOYEE_FORM_COPY.errors.saveFailed,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    authDisabled,
    copy,
    email,
    error,
    fullName,
    hasSession,
    isSupabaseConfigured,
    onContinue: handleContinue,
    onEmailChange: setEmail,
    onFullNameChange: setFullNameOverride,
    onPasswordChange: setPassword,
    password,
    redirectHref,
    stepTotal,
    submitting,
  };
}
