"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { LOGIN_COPY } from "@/copy/login-copy";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas/reset-password-schema";
import { supabase } from "@/lib/supabase";

const REDIRECT_DELAY_MS = 3000;

const SENSITIVE_QUERY_PARAMETERS = [
  "access_token",
  "code",
  "error",
  "error_code",
  "error_description",
  "refresh_token",
  "type",
] as const;

export type ResetPasswordStatus = "loading" | "ready" | "invalid" | "success";

export type RecoveryLinkError = "expired" | "invalid";

function isExpiredRecoveryError(
  code: string | null,
  description: string | null,
) {
  const normalizedError = `${code ?? ""} ${description ?? ""}`.toLowerCase();

  return normalizedError.includes("expired") || code === "otp_expired";
}

function cleanRecoveryUrl(url: URL) {
  SENSITIVE_QUERY_PARAMETERS.forEach((parameter) => {
    url.searchParams.delete(parameter);
  });
  url.hash = "";

  const search = url.searchParams.toString();
  const cleanUrl = `${url.pathname}${search ? `?${search}` : ""}`;
  globalThis.history.replaceState(globalThis.history.state, "", cleanUrl);
}

export function useResetPassword() {
  const initializedRef = useRef(false);
  const [status, setStatus] = useState<ResetPasswordStatus>("loading");
  const [linkError, setLinkError] = useState<RecoveryLinkError | null>(null);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const establishSession = async () => {
      const url = new URL(globalThis.location.href);
      const hashParams = new URLSearchParams(url.hash.slice(1));
      const errorCode =
        hashParams.get("error_code") ?? url.searchParams.get("error_code");
      const errorDescription =
        hashParams.get("error_description") ??
        url.searchParams.get("error_description");
      const code = url.searchParams.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      try {
        if (errorCode) {
          const recoveryError = isExpiredRecoveryError(
            errorCode,
            errorDescription,
          )
            ? "expired"
            : "invalid";
          setLinkError(recoveryError);
          setStatus("invalid");
          toast.error(LOGIN_COPY.resetPassword.errors[recoveryError]);
          return;
        }

        if (accessToken || refreshToken || type) {
          if (!accessToken || !refreshToken || type !== "recovery") {
            setLinkError("invalid");
            setStatus("invalid");
            toast.error(LOGIN_COPY.resetPassword.errors.invalid);
            return;
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            const recoveryError = isExpiredRecoveryError(
              error.code ?? null,
              error.message,
            )
              ? "expired"
              : "invalid";
            setLinkError(recoveryError);
            setStatus("invalid");
            toast.error(LOGIN_COPY.resetPassword.errors[recoveryError]);
            return;
          }
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            const recoveryError = isExpiredRecoveryError(
              error.code ?? null,
              error.message,
            )
              ? "expired"
              : "invalid";
            setLinkError(recoveryError);
            setStatus("invalid");
            toast.error(LOGIN_COPY.resetPassword.errors[recoveryError]);
            return;
          }
        }

        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          setLinkError("invalid");
          setStatus("invalid");
          toast.error(LOGIN_COPY.resetPassword.errors.invalid);
          return;
        }

        setStatus("ready");
      } catch {
        setLinkError("invalid");
        setStatus("invalid");
        toast.error(LOGIN_COPY.resetPassword.errors.invalid);
      } finally {
        cleanRecoveryUrl(url);
      }
    };

    void establishSession();
  }, []);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const timeout = globalThis.setTimeout(() => {
      globalThis.location.replace("/dashboard");
    }, REDIRECT_DELAY_MS);

    return () => globalThis.clearTimeout(timeout);
  }, [status]);

  const handleSubmit = form.handleSubmit(async ({ password }) => {
    form.clearErrors("root");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      const message = LOGIN_COPY.resetPassword.errors.updateFailed;
      form.setError("root", { message });
      toast.error(message);
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      const message = LOGIN_COPY.resetPassword.errors.sessionLost;
      form.setError("root", { message });
      toast.error(message);
      return;
    }

    toast.success(LOGIN_COPY.resetPassword.toastSuccess);
    setStatus("success");
  });

  return {
    form,
    handleSubmit,
    linkError,
    status,
  };
}
