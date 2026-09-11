import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ResetPasswordPageClient from "@/components/auth/reset-password/page.client";
import { LOGIN_COPY } from "@/copy/login-copy";
import { useResetPassword } from "@/lib/hooks/use-reset-password";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      exchangeCodeForSession: vi.fn(),
      getUser: vi.fn(),
      setSession: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const validUserResponse = {
  data: { user: { id: "user-id" } },
  error: null,
};

describe("reset password", () => {
  beforeEach(() => {
    globalThis.history.replaceState({}, "", "/reset-password");
    vi.mocked(supabase.auth.setSession).mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });
    vi.mocked(supabase.auth.exchangeCodeForSession).mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    } as never);
    vi.mocked(supabase.auth.getUser).mockResolvedValue(
      validUserResponse as never,
    );
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as never);
  });

  it("establishes an implicit recovery session and removes the tokens", async () => {
    globalThis.history.replaceState(
      {},
      "",
      "/reset-password#access_token=access&refresh_token=refresh&type=recovery",
    );
    const { result } = renderHook(() => useResetPassword());

    await waitFor(() => expect(result.current.status).toBe("ready"));

    expect(supabase.auth.setSession).toHaveBeenCalledWith({
      access_token: "access",
      refresh_token: "refresh",
    });
    expect(globalThis.location.pathname).toBe("/reset-password");
    expect(globalThis.location.hash).toBe("");
  });

  it("exchanges legacy PKCE codes and removes them from the URL", async () => {
    globalThis.history.replaceState(
      {},
      "",
      "/reset-password?code=legacy-code&source=email",
    );
    const { result } = renderHook(() => useResetPassword());

    await waitFor(() => expect(result.current.status).toBe("ready"));

    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "legacy-code",
    );
    expect(globalThis.location.search).toBe("?source=email");
  });

  it("shows an expired-link action without rendering the password form", async () => {
    globalThis.history.replaceState(
      {},
      "",
      "/reset-password#error=access_denied&error_code=otp_expired",
    );

    render(<ResetPasswordPageClient />);

    expect(
      await screen.findByText(LOGIN_COPY.resetPassword.errors.expired),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: LOGIN_COPY.resetPassword.requestNewLink,
      }),
    ).toHaveAttribute("href", "/forgot-password");
    expect(
      screen.queryByLabelText(LOGIN_COPY.resetPassword.newPassword),
    ).not.toBeInTheDocument();
  });

  it("rejects incomplete implicit parameters", async () => {
    globalThis.history.replaceState(
      {},
      "",
      "/reset-password#access_token=access&type=recovery",
    );
    const { result } = renderHook(() => useResetPassword());

    await waitFor(() => expect(result.current.status).toBe("invalid"));

    expect(result.current.linkError).toBe("invalid");
    expect(supabase.auth.setSession).not.toHaveBeenCalled();
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("does not allow a reset when the established session is invalid", async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: new Error("Auth session missing"),
    } as never);
    const { result } = renderHook(() => useResetPassword());

    await waitFor(() => expect(result.current.status).toBe("invalid"));

    expect(result.current.linkError).toBe("invalid");
  });

  it("keeps the form ready and reports update failures", async () => {
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: null },
      error: new Error("update failed"),
    } as never);
    const { result } = renderHook(() => useResetPassword());
    await waitFor(() => expect(result.current.status).toBe("ready"));

    act(() => {
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
    });
    await act(() => result.current.handleSubmit());

    expect(result.current.status).toBe("ready");
    expect(
      result.current.form.getFieldState("root" as never).error?.message,
    ).toBe(LOGIN_COPY.resetPassword.errors.updateFailed);
  });

  it("moves to success only after updating and revalidating the user", async () => {
    const { result } = renderHook(() => useResetPassword());
    await waitFor(() => expect(result.current.status).toBe("ready"));

    act(() => {
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
    });
    await act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(2);
  });
});
