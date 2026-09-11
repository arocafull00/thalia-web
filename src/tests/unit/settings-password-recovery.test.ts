import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestPasswordRecovery } from "@/lib/auth/password-recovery";
import { useSettingsPageActions } from "@/lib/hooks/use-settings-page";

const { setPasswordSubmitting } = vi.hoisted(() => ({
  setPasswordSubmitting: vi.fn(),
}));

vi.mock("@/lib/auth/password-recovery", () => ({
  requestPasswordRecovery: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/lib/hooks/use-active-clinic", () => ({
  useActiveClinic: () => ({ platformRole: "admin" }),
}));

vi.mock("@/lib/hooks/use-auth", () => ({
  useAuth: () => ({
    profile: null,
    signOut: vi.fn(),
    user: { email: "settings@example.com" },
  }),
  useUploadProfileAvatar: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/lib/hooks/use-employees", () => ({
  useEmployees: () => ({ data: [] }),
}));

vi.mock("@/lib/hooks/use-pending-clinic-requests", () => ({
  usePendingClinicRequests: () => ({ requests: [] }),
}));

vi.mock("@/lib/settings-sections", () => ({
  canManageClinicSettings: () => true,
}));

vi.mock("@/stores/settings-ui-store", () => ({
  useSettingsUiStore: (selector: (state: object) => unknown) =>
    selector({
      localAvatarUri: null,
      passwordSubmitting: false,
      setLocalAvatarUri: vi.fn(),
      setPasswordSubmitting,
      setSignOutSubmitting: vi.fn(),
      signOutSubmitting: false,
    }),
}));

describe("settings password recovery", () => {
  beforeEach(() => {
    vi.mocked(requestPasswordRecovery).mockResolvedValue(null);
  });

  it("uses the shared implicit recovery request for the signed-in user", async () => {
    const { result } = renderHook(() => useSettingsPageActions());

    await act(() => result.current.handleChangePassword());

    expect(requestPasswordRecovery).toHaveBeenCalledWith(
      "settings@example.com",
    );
    expect(setPasswordSubmitting).toHaveBeenNthCalledWith(1, true);
    expect(setPasswordSubmitting).toHaveBeenNthCalledWith(2, false);
  });
});
