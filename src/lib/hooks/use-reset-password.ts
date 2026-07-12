"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LOGIN_COPY } from "@/copy/login-copy";
import { supabase } from "@/lib/supabase";

export function useResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (updateError.message.toLowerCase().includes("expired")) {
        setError(
          "El enlace ha expirado. Solicita un nuevo enlace de recuperación.",
        );
      } else {
        setError(updateError.message);
      }
      return;
    }

    router.replace(
      `/login?message=${encodeURIComponent(LOGIN_COPY.resetPassword.success)}`,
    );
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
    submitting,
    error,
    handleSubmit,
  };
}
