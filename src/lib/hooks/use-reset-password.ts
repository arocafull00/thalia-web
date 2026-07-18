"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { LOGIN_COPY } from "@/copy/login-copy";
import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { supabase } from "@/lib/supabase";

const REDIRECT_DELAY_MS = 3000;

export function useResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace("/dashboard");
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [success, router]);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);

    const urlError =
      hashParams.get("error_code") ?? searchParams.get("error_code");
    const code = searchParams.get("code");
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    const establish = async () => {
      if (urlError) {
        setError("El enlace de recuperación no es válido o ha expirado.");
      } else if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(getAuthErrorMessage(exchangeError));
        }
      } else if (accessToken && refreshToken && type === "recovery") {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setError(getAuthErrorMessage(sessionError));
        }
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("El enlace de recuperación no es válido o ha expirado.");
        }
      }
      setLoading(false);
    };

    void establish();
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setSubmitting(false);

    if (updateError) {
      setError(getAuthErrorMessage(updateError));
      return;
    }

    toast.success(LOGIN_COPY.resetPassword.toastSuccess);
    setSuccess(true);
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    submitting,
    success,
    error,
    handleSubmit,
  };
}
