import { SETTINGS_COPY } from "@/copy/settings-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth, useUploadProfileAvatar } from "@/lib/hooks/use-auth";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePendingClinicRequests } from "@/lib/hooks/use-pending-clinic-requests";
import { compressAvatarImage } from "@/lib/image-compression";
import { supabase } from "@/lib/supabase";
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
  const passwordMessage = useSettingsUiStore((state) => state.passwordMessage);
  const passwordSubmitting = useSettingsUiStore(
    (state) => state.passwordSubmitting,
  );
  const signOutSubmitting = useSettingsUiStore(
    (state) => state.signOutSubmitting,
  );
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const setPasswordMessage = useSettingsUiStore(
    (state) => state.setPasswordMessage,
  );
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

  const isAdmin = profile?.role === "admin";
  const activeEmployeesCount =
    employees.data?.filter((employee) => employee.active).length ?? 0;

  const handleChangePassword = async () => {
    if (!user?.email) {
      setPasswordMessage("No hay un email asociado a esta cuenta.");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordMessage(null);

    const origin =
      typeof globalThis.location !== "undefined"
        ? globalThis.location.origin
        : "";
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${origin}/callback?next=/reset-password`,
    });

    setPasswordSubmitting(false);

    if (error) {
      setPasswordMessage(SETTINGS_COPY.account.changePasswordError);
      return;
    }

    setPasswordMessage("Revisa tu email para crear una nueva contraseña.");
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
    uploadAvatar.mutate({ file: compressedFile });
  };

  return {
    activeEmployeesCount,
    canViewClinicRequests,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    isAdmin,
    localAvatarUri,
    passwordMessage,
    passwordSubmitting,
    pendingClinicRequests,
    profile,
    signOutSubmitting,
    uploadAvatar,
    user,
  };
}
