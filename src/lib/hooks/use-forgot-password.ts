"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { LOGIN_COPY } from "@/copy/login-copy";
import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { requestPasswordRecovery } from "@/lib/auth/password-recovery";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const recoveryError = await requestPasswordRecovery(email);

      if (recoveryError) {
        const message = getAuthErrorMessage(recoveryError);
        setError(message);
        toast.error(message);
        return;
      }

      setSubmitted(true);
      toast.success(LOGIN_COPY.forgotPassword.success);
    } catch (cause) {
      const message = getAuthErrorMessage(cause);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    submitting,
    submitted,
    error,
    handleSubmit,
  };
}
