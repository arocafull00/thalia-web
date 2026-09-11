import { toast } from "react-toastify";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import { requestPasswordRecovery } from "@/lib/auth/password-recovery";
import { employeeRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth, useUploadProfileAvatar } from "@/lib/hooks/use-auth";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePendingClinicRequests } from "@/lib/hooks/use-pending-clinic-requests";
import { compressAvatarImage } from "@/lib/image-compression";
import { canManageClinicSettings } from "@/lib/settings-sections";
import { useSettingsUiStore } from "@/stores/settings-ui-store";
import type { EmployeeRole, Employee } from "@/types/database.types";

export function buildProfileSubtitle(
  specialty: string | null,
  role: EmployeeRole,
) {
  const roleLabel = employeeRoleLabel(role).toUpperCase();
  const specialtyLabel = specialty?.toUpperCase();

  if (specialtyLabel) {
    return `${specialtyLabel} • ${roleLabel}`;
  }

  return roleLabel;
}

export function useSettingsPageActions(initialEmployees?: Employee[]) {
  const { platformRole } = useActiveClinic();
  const { profile, signOut, user } = useAuth();
  const canViewClinicRequests =
    platformRole === "employee" || platformRole === "external";
  const { requests: pendingClinicRequests } = usePendingClinicRequests(
    user?.email,
    canViewClinicRequests,
  );
  const employees = useEmployees(initialEmployees);
  const passwordSubmitting = useSettingsUiStore(
    (state) => state.passwordSubmitting,
  );
  const signOutSubmitting = useSettingsUiStore(
    (state) => state.signOutSubmitting,
  );
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const setPasswordSubmitting = useSettingsUiStore(
    (state) => state.setPasswordSubmitting,
  );
  const setSignOutSubmitting = useSettingsUiStore(
    (state) => state.setSignOutSubmitting,
  );
  const setLocalAvatarUri = useSettingsUiStore(
    (state) => state.setLocalAvatarUri,
  );
  const uploadAvatar = useUploadProfileAvatar();

  const canManageClinic = canManageClinicSettings(platformRole);
  const activeEmployeesCount =
    employees.data?.filter((employee) => employee.active).length ?? 0;

  const handleChangePassword = async () => {
    if (!user?.email) {
      toast.error(SETTINGS_COPY.account.changePasswordNoEmail);
      return;
    }

    setPasswordSubmitting(true);

    try {
      const error = await requestPasswordRecovery(user.email);

      if (error) {
        toast.error(SETTINGS_COPY.account.changePasswordError);
        return;
      }

      toast.success(SETTINGS_COPY.account.changePasswordSuccess);
    } catch {
      toast.error(SETTINGS_COPY.account.changePasswordError);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSignOutSubmitting(true);

    try {
      await signOut();
      globalThis.location.href = "/login";
    } catch {
      setSignOutSubmitting(false);
    }
  };

  const handleAvatarPress = async (file: File) => {
    const compressedFile = await compressAvatarImage(file);

    if (localAvatarUri) {
      URL.revokeObjectURL(localAvatarUri);
    }

    const previewUrl = URL.createObjectURL(compressedFile);
    setLocalAvatarUri(previewUrl);
    uploadAvatar.mutate(
      { file: compressedFile },
      {
        onSuccess: () => {
          URL.revokeObjectURL(previewUrl);
          setLocalAvatarUri(null);
        },
      },
    );
  };

  return {
    activeEmployeesCount,
    canViewClinicRequests,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    canManageClinic,
    localAvatarUri,
    passwordSubmitting,
    pendingClinicRequests,
    profile,
    signOutSubmitting,
    uploadAvatar,
    user,
  };
}
