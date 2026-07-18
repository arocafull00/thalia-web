"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

import { supabaseAnonKey, supabaseUrl } from "@/lib/environment";

// createBrowserClient from @supabase/ssr always forces PKCE regardless of options.
// Use createClient directly so flowType: 'implicit' is actually respected,
// which makes the reset link work from any browser without a stored code verifier.
const supabaseImplicit = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { flowType: "implicit" },
});

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

    await supabaseImplicit.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/reset-password`,
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
