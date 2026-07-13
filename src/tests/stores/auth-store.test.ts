import { describe, it, expect, beforeEach, vi } from "vitest";

import * as authDal from "@/dal/auth.dal";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { mockEmployee, EMPLOYEE_ID } from "@/tests/mocks";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
  assertSupabaseConfigured: vi.fn(),
}));

vi.mock("@/dal/auth.dal", () => ({
  getEmployeeProfile: vi.fn(),
  updateEmployeeProfile: vi.fn(),
  updateEmployeeAvatar: vi.fn(),
}));

vi.mock("@/stores/employees-store", () => ({
  useEmployeesStore: {
    getState: vi.fn(() => ({
      fetchEmployees: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(),
}));

const initialState = {
  session: null,
  profile: null,
  loading: true,
  updating: false,
  updateError: null,
  uploadingAvatar: false,
  uploadAvatarError: null,
};

describe("auth-store", () => {
  beforeEach(() => {
    useAuthStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.updating).toBe(false);
    expect(state.updateError).toBeNull();
  });

  it("signIn calls supabase with credentials and succeeds", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    } as never);

    await useAuthStore.getState().signIn("user@test.com", "password123");

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "password123",
    });
  });

  it("signIn throws when supabase returns an error", async () => {
    const authError = { message: "Invalid credentials", status: 400 };
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: authError,
    } as never);

    await expect(
      useAuthStore.getState().signIn("user@test.com", "wrong"),
    ).rejects.toEqual(authError);
  });

  it("refreshProfile sets profile to null when no session", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as never);

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toBeNull();
    expect(authDal.getEmployeeProfile).not.toHaveBeenCalled();
  });

  it("refreshProfile fetches and sets profile when session exists", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: EMPLOYEE_ID } } },
      error: null,
    } as never);
    vi.mocked(authDal.getEmployeeProfile).mockResolvedValue(
      mockEmployee as never,
    );

    await useAuthStore.getState().refreshProfile();

    expect(authDal.getEmployeeProfile).toHaveBeenCalledWith(EMPLOYEE_ID);
    expect(useAuthStore.getState().profile).toEqual(mockEmployee);
  });

  it("signOut calls supabase.auth.signOut", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    await useAuthStore.getState().signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
