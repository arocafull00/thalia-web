import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestPasswordRecovery } from "@/lib/auth/password-recovery";
import { useForgotPassword } from "@/lib/hooks/use-forgot-password";

const { resetPasswordForEmail } = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn((_url, _key, options) => {
    expect(options.auth.flowType).toBe("implicit");
    expect(options.auth.detectSessionInUrl).toBe(false);

    return {
      auth: { resetPasswordForEmail },
    };
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("password recovery request", () => {
  beforeEach(() => {
    globalThis.history.replaceState({}, "", "/forgot-password");
    resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("uses the implicit client and the direct reset route", async () => {
    await requestPasswordRecovery("  user@example.com  ");

    expect(resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "http://localhost:3000/reset-password",
    });
  });

  it("only marks the forgot-password form as sent when Supabase succeeds", async () => {
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail("user@example.com"));
    await act(() => result.current.handleSubmit());

    expect(result.current.submitted).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("keeps the forgot-password form active when Supabase fails", async () => {
    resetPasswordForEmail.mockResolvedValue({
      error: new Error("rate limit exceeded"),
    });
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail("user@example.com"));
    await act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.submitted).toBe(false));
    expect(result.current.error).toBe(
      "Demasiados intentos. Inténtalo de nuevo más tarde.",
    );
  });
});
