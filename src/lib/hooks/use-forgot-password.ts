"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    const origin =
      typeof globalThis.location !== "undefined"
        ? globalThis.location.origin
        : "";

    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/callback?next=/reset-password`,
    });

    setSubmitting(false);
    setSubmitted(true);
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
